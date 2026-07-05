import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class RecommendationEngine:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.items = [
            {"type": "course", "title": "Advanced Kubernetes & Docker", "skills": ["Kubernetes", "Docker", "DevOps"]},
            {"type": "course", "title": "Mastering GraphQL with Apollo", "skills": ["GraphQL", "React", "Node.js"]},
            {"type": "project", "title": "Build a scalable Vector Database", "skills": ["Python", "C++", "System Design", "Vector Search"]},
            {"type": "job", "title": "Senior Frontend Engineer at Stripe", "skills": ["React", "TypeScript", "UI/UX", "Framer Motion"]},
            {"type": "course", "title": "System Design Interview Prep", "skills": ["System Design", "Architecture", "Scalability"]},
            {"type": "job", "title": "Backend Python Developer", "skills": ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy"]}
        ]
        
        # Build embeddings string
        self.texts = [" ".join(item["skills"]) + " " + item["title"] for item in self.items]
        self.embeddings = self.model.encode(self.texts)
        
        # Initialize FAISS Index
        self.dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(self.embeddings.astype(np.float32))

    def recommend(self, missing_skills: list, top_k: int = 3):
        if not missing_skills:
            return []
            
        query = " ".join(missing_skills)
        query_vector = self.model.encode([query]).astype(np.float32)
        
        distances, indices = self.index.search(query_vector, top_k)
        
        results = []
        for i in indices[0]:
            if i != -1: # Valid match
                results.append(self.items[i])
                
        return results

# Singleton instance
engine = RecommendationEngine()

def get_recommendations_for_skills(skills: list, top_k: int = 2):
    return engine.recommend(skills, top_k=top_k)
