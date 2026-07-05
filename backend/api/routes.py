from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from agents.coordinator import app as workflow_app
from langchain_core.messages import HumanMessage

router = APIRouter()

class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    session_id: str

@router.post("/analyze-resume")
async def analyze_resume(req: ResumeAnalysisRequest):
    """
    Endpoint to parse resume, calculate ATS score, and classify the role.
    """
    # Simulate processing (In production, this routes to the PyMuPDF/SpaCy parser pipeline)
    return {
        "status": "success",
        "ats_score": 85,
        "classification": "Software Engineer",
        "missing_skills": ["Kubernetes", "GraphQL"],
        "message": "Resume analyzed successfully."
    }

@router.post("/chat")
async def chat_with_mentor(req: ChatRequest):
    """
    Endpoint to interact with the LangGraph Coordinator Agent.
    """
    try:
        # Initialize state with the user's message
        initial_state = {
            "messages": [HumanMessage(content=req.message)],
            "current_agent": "career_mentor_agent"
        }
        
        # Invoke the LangGraph workflow
        result = workflow_app.invoke(initial_state)
        
        # Extract the last message from the agent
        response_msg = result["messages"][-1].content
        
        return {
            "status": "success",
            "response": response_msg
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/coding")
async def get_coding_analytics(user_id: str):
    """
    Endpoint to fetch coding performance analytics.
    """
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
    """
    Endpoint to suggest courses, projects, and jobs based on vector similarity.
    """
    return {
        "status": "success",
        "recommendations": [
            {"type": "course", "title": "Advanced System Design", "url": "https://example.com/sys-design"},
            {"type": "project", "title": "Build a Vector DB", "url": "https://example.com/proj-vector"}
        ]
    }
