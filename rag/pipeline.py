import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from vector_db.store import VectorStore

class RAGPipeline:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
        
        # We will use Gemini 3.1 Pro as configured
        # Ensure GOOGLE_API_KEY is in environment
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",  # Or whatever specific Gemini model alias you want
            temperature=0.3
        )
        
        self.prompt_template = PromptTemplate.from_template(
            "You are an expert AI Career Mentor.\n"
            "Use the following context to answer the user's question.\n"
            "If you don't know the answer based on context, you can use your general knowledge but mention it.\n\n"
            "Context: {context}\n"
            "Question: {question}\n\n"
            "Answer:"
        )
        self.chain = self.prompt_template | self.llm | StrOutputParser()

    def generate_response(self, question: str) -> str:
        # Retrieve context
        docs = self.vector_store.similarity_search(question, k=4)
        context = "\n".join([doc.page_content for doc in docs])
        
        # Generate answer
        response = self.chain.invoke({
            "context": context,
            "question": question
        })
        return response
