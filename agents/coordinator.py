from typing import Literal
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from agents.state import AppState
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2)

def router_node(state: AppState):
    """
    The router determines which agent should handle the user query based on the last message.
    """
    last_msg = state["messages"][-1].content.lower()
    
    if "resume" in last_msg or "parser" in last_msg:
        next_agent = "resume_agent"
    elif "ats" in last_msg or "score" in last_msg:
        next_agent = "ats_agent"
    elif "interview" in last_msg or "mock" in last_msg:
        next_agent = "interview_agent"
    else:
        next_agent = "career_mentor_agent"
        
    return {"current_agent": next_agent}

def router_condition(state: AppState) -> Literal["resume_agent", "ats_agent", "interview_agent", "career_mentor_agent"]:
    return state["current_agent"]

def resume_agent_node(state: AppState):
    prompt = f"""You are an expert Resume Parsing Agent.
The user is asking about their resume.
User message: {state['messages'][-1].content}

Provide professional, concise advice regarding resume structuring and parsing.
"""
    response = llm.invoke(prompt)
    return {"messages": [SystemMessage(content=response.content)]}

def ats_agent_node(state: AppState):
    prompt = f"""You are an ATS (Applicant Tracking System) Optimization Agent.
User message: {state['messages'][-1].content}

Provide insights on ATS keywords, formatting, and scoring optimization.
"""
    response = llm.invoke(prompt)
    return {"messages": [SystemMessage(content=response.content)]}

def interview_agent_node(state: AppState):
    prompt = f"""You are a Technical Interview Agent.
User message: {state['messages'][-1].content}

Provide a short mock interview question or specific interview preparation advice.
"""
    response = llm.invoke(prompt)
    return {"messages": [SystemMessage(content=response.content)]}

def career_mentor_agent_node(state: AppState):
    prompt = f"""You are an Enterprise AI Career Mentor.
User message: {state['messages'][-1].content}

Provide strategic career advice, roadmap suggestions, or general mentoring. Maintain a highly professional and encouraging tone.
"""
    response = llm.invoke(prompt)
    return {"messages": [SystemMessage(content=response.content)]}

def build_workflow():
    workflow = StateGraph(AppState)
    
    # Add nodes
    workflow.add_node("router", router_node)
    workflow.add_node("resume_agent", resume_agent_node)
    workflow.add_node("ats_agent", ats_agent_node)
    workflow.add_node("interview_agent", interview_agent_node)
    workflow.add_node("career_mentor_agent", career_mentor_agent_node)
    
    # Edges
    workflow.add_edge(START, "router")
    
    workflow.add_conditional_edges(
        "router",
        router_condition,
        {
            "resume_agent": "resume_agent",
            "ats_agent": "ats_agent",
            "interview_agent": "interview_agent",
            "career_mentor_agent": "career_mentor_agent"
        }
    )
    
    # End edges
    workflow.add_edge("resume_agent", END)
    workflow.add_edge("ats_agent", END)
    workflow.add_edge("interview_agent", END)
    workflow.add_edge("career_mentor_agent", END)
    
    return workflow.compile()

# Singleton instance
app = build_workflow()

if __name__ == "__main__":
    print("LangGraph workflow compiled successfully.")
