from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import List, Optional
from agents.coordinator import app as workflow_app
from langchain_core.messages import HumanMessage
from resume_parser.parser import ResumeParser
from sqlalchemy.orm import Session
from database import get_db
import models
from vector_store import get_recommendations_for_skills
from auth import get_current_user
import tempfile
import os
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str

@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), job_description: Optional[str] = Form(None), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Endpoint to parse resume PDF, calculate ATS score, classify the role, and save to DB.
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Extract text and entities
        parser = ResumeParser(tmp_path)
        parsed_data = parser.parse()
        os.remove(tmp_path)
        
        # Build prompt for LangGraph resume agent
        prompt = f"Analyze this resume data. Email: {parsed_data['email']}. Entities: {parsed_data['entities']}. Raw text length: {parsed_data['raw_text_length']}."
        if job_description:
            prompt += f"\nTarget Job Description: {job_description}"
            
        prompt += "\nOutput JSON with exactly these keys: ats_score (int), classification (string), missing_skills (list of strings), message (string advice)."

        # Invoke LangGraph
        initial_state = {
            "messages": [HumanMessage(content=prompt)],
            "current_agent": "resume_agent"
        }
        
        result = workflow_app.invoke(initial_state)
        response_msg = result["messages"][-1].content
        
        # Parse JSON response
        try:
            cleaned_resp = response_msg.replace('```json', '').replace('```', '').strip()
            ai_data = json.loads(cleaned_resp)
        except:
            ai_data = {
                "ats_score": 75,
                "classification": "General",
                "missing_skills": [],
                "message": response_msg
            }

        # Save to DB
        analysis = models.ResumeAnalysis(
            user_id=current_user.id,
            ats_score=ai_data.get("ats_score", 0),
            classification=ai_data.get("classification", ""),
            missing_skills=ai_data.get("missing_skills", []),
            raw_text=parser.text
        )
        db.add(analysis)
        db.commit()

        return {
            "status": "success",
            "parsed_entities": parsed_data["entities"],
            **ai_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat_with_mentor(req: ChatRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Endpoint to interact with the LangGraph Coordinator Agent and save chat history.
    """
    try:
        initial_state = {
            "messages": [HumanMessage(content=req.message)],
            "current_agent": "career_mentor_agent"
        }
        
        result = workflow_app.invoke(initial_state)
        response_msg = result["messages"][-1].content
        
        # Save to ChatSession
        chat_session = db.query(models.ChatSession).filter(models.ChatSession.user_id == current_user.id).first()
        if not chat_session:
            chat_session = models.ChatSession(user_id=current_user.id, messages=[])
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)
            
        # Append message history
        current_msgs = list(chat_session.messages)
        current_msgs.append({"role": "user", "content": req.message})
        current_msgs.append({"role": "ai", "content": response_msg})
        chat_session.messages = current_msgs
        db.commit()
        
        return {
            "status": "success",
            "response": response_msg
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history")
async def get_chat_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Fetch the authenticated user's historical AI Chat logs.
    """
    chat_session = db.query(models.ChatSession).filter(models.ChatSession.user_id == current_user.id).first()
    if not chat_session:
        return {"status": "success", "messages": []}
    return {"status": "success", "messages": chat_session.messages}

@router.get("/recommendations")
async def get_recommendations(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Suggest courses and jobs using FAISS Vector Search based on the user's latest missing skills.
    """
    try:
        latest_resume = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).first()
        
        if not latest_resume or not latest_resume.missing_skills:
            # Fallback if no resume analysis exists
            fallback = get_recommendations_for_skills(["Python", "React"])
            return {"status": "success", "recommendations": fallback}
            
        # Query FAISS vector store
        recommendations = get_recommendations_for_skills(latest_resume.missing_skills)
        return {
            "status": "success",
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/coding")
async def get_coding_analytics(user_id: str):
    return {
        "status": "success",
        "data": {
            "solved": 120,
            "easy": 50,
            "medium": 60,
            "hard": 10,
            "weak_topics": ["Dynamic Programming", "Graphs"],
            "strong_topics": ["Arrays", "Hash Tables"]
        }
    }
