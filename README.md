# CareerForgeAI

**Enterprise AI Career Mentor & Placement Intelligence Platform**

CareerForgeAI is a comprehensive platform designed to act as a personal placement coach. It combines classical machine learning, natural language processing, vector search (RAG), and LangGraph multi-agent workflows to evaluate resumes, provide ATS scoring, predict best-fit engineering roles, analyze skill gaps, and conduct personalized mock interviews.

## Features
- **Smart Resume Parser**: Extracts entities, skills, and contact info via PyMuPDF and spaCy.
- **ATS Scoring Engine**: Grades your resume against target job descriptions and provides actionable feedback.
- **Role Classification**: Suggests the optimal engineering role based on your experience using an ML Classifier.
- **Multi-Agent Workflow**: LangGraph architecture coordinating multiple specialized agents (`ResumeAgent`, `ATSAgent`, `InterviewAgent`, `CareerMentor`).
- **AI Career Mentor**: Powered by Gemini Pro and FAISS for Retrieval-Augmented Generation (RAG).
- **Premium Dashboard**: Glassmorphism UI with rich analytics (Recharts) for learning progress tracking.

## Technology Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Query.
- **Backend**: FastAPI, Python, SQLAlchemy, Pydantic.
- **AI & ML**: Scikit-Learn, spaCy, HuggingFace, SentenceTransformers.
- **Agents & RAG**: LangChain, LangGraph, FAISS, Gemini API.
- **Infrastructure**: PostgreSQL, Redis, Celery, Docker, GitHub Actions CI/CD.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20.x
- Python 3.10+

### Local Setup (Docker)
We use Docker to spin up the PostgreSQL database and Redis instance easily.

```bash
docker-compose up -d
```

### Backend Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r backend/requirements.txt
```
Copy `backend/.env.example` to `backend/.env` and update your Gemini API keys and DB credentials.
Start the server:
```bash
uvicorn backend.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Architecture
The application orchestrates requests through a FastAPI backend which delegates generative tasks to a LangGraph Coordinator. The Coordinator decides which AI Agent should handle the query and generates context via FAISS similarity search.
