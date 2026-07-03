from typing import Literal
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from agents.state import AppState

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)

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
    """
    LangGraph conditional edge routing based on state.
    """
    return state["current_agent"]

def dummy_agent_node(agent_name: str, response_prefix: str):
    """
    Factory for simple agent nodes for structure.
    """
    def node(state: AppState):
        msg = f"[{agent_name}] {response_prefix}: I have analyzed your request regarding '{state['messages'][-1].content}'."
        return {"messages": [SystemMessage(content=msg)]}
    return node

def build_workflow():
    workflow = StateGraph(AppState)
    
    # Add nodes
    workflow.add_node("router", router_node)
    workflow.add_node("resume_agent", dummy_agent_node("ResumeAgent", "Processing resume details"))
    workflow.add_node("ats_agent", dummy_agent_node("ATSAgent", "Calculating ATS score and keywords"))
    workflow.add_node("interview_agent", dummy_agent_node("InterviewAgent", "Generating mock interview scenario"))
    workflow.add_node("career_mentor_agent", dummy_agent_node("CareerMentor", "Providing career advice"))
    
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

if __name__ == "__main__":
    app = build_workflow()
    print("LangGraph workflow compiled successfully.")
