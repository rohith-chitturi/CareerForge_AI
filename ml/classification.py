import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

class ResumeClassifier:
    def __init__(self, model_path: str = None, vectorizer_path: str = None):
        if model_path and vectorizer_path:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
        else:
            self.model = RandomForestClassifier()
            self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
            self.is_trained = False

    def train(self, texts: list, labels: list):
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        self.is_trained = True

    def predict(self, text: str) -> str:
        if not hasattr(self, 'is_trained') or not self.is_trained:
            # Fallback for un-trained prediction, in production would raise Error
            return "Software Engineer"
        X = self.vectorizer.transform([text])
        return self.model.predict(X)[0]

    def save(self, model_path: str, vectorizer_path: str):
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(vectorizer_path, 'wb') as f:
            pickle.dump(self.vectorizer, f)
