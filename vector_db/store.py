from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

class VectorStore:
    def __init__(self, index_path: str = None):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.index_path = index_path
        if index_path:
            try:
                self.db = FAISS.load_local(index_path, self.embeddings, allow_dangerous_deserialization=True)
            except:
                self.db = None
        else:
            self.db = None

    def add_texts(self, texts: list[str], metadatas: list[dict] = None):
        if not self.db:
            self.db = FAISS.from_texts(texts, self.embeddings, metadatas=metadatas)
        else:
            self.db.add_texts(texts, metadatas=metadatas)

    def similarity_search(self, query: str, k: int = 4):
        if not self.db:
            return []
        return self.db.similarity_search(query, k=k)

    def save(self, path: str):
        if self.db:
            self.db.save_local(path)
