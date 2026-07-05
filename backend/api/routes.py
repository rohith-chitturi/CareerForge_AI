from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from agents.coordinator import app as workflow_app
from langchain_core.messages import HumanMessage
from resume_parser.parser import ResumeParser
import tempfile
import os
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str

@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), job_description: Optional[str] = Form(None)):
    """
    Endpoint to parse resume PDF, calculate ATS score, and classify the role using LangGraph.
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
        
        # Cleanup temp file
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
        
        # Parse the JSON response from Gemini
        try:
            # Clean up markdown code blocks if Gemini returns them
            cleaned_resp = response_msg.replace('```json', '').replace('```', '').strip()
            ai_data = json.loads(cleaned_resp)
        except:
            ai_data = {
                "ats_score": 75,
                "classification": "General",
                "missing_skills": [],
                "message": response_msg
            }

        return {
            "status": "success",
            "parsed_entities": parsed_data["entities"],
            **ai_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat_with_mentor(req: ChatRequest):
    """
    Endpoint to interact with the LangGraph Coordinator Agent.
    """
    try:
        initial_state = {
            "messages": [HumanMessage(content=req.message)],
            "current_agent": "career_mentor_agent"
        }
        
        result = workflow_app.invoke(initial_state)
        response_msg = result["messages"][-1].content
        
        return {
            "status": "success",
            "response": response_msg
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

@router.get("/recommendations")
async def get_recommendations(user_id: str):
    return {
        "status": "success",
        "recommendations": [
            {"type": "course", "title": "Advanced System Design", "url": "https://example.com/sys-design"},
            {"type": "project", "title": "Build a Vector DB", "url": "https://example.com/proj-vector"}
        ]
    }
