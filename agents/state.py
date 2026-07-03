from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage

class AppState(TypedDict):
    """
    Represents the state of our LangGraph workflow.
    """
    messages: Annotated[Sequence[BaseMessage], operator.add]
    current_agent: str
    user_id: str
    context_data: dict
