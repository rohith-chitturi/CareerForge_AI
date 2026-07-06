from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
from api.auth_routes import router as auth_router
from database import engine, Base
import models

# Create database tables
Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="CareerForgeAI API",
    description="Enterprise AI Career Mentor & Placement Intelligence Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to CareerForgeAI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
