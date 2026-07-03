import re
import fitz  # PyMuPDF
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

class ResumeParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.text = self._extract_text()

    def _extract_text(self) -> str:
        text = ""
        try:
            with fitz.open(self.file_path) as doc:
                for page in doc:
                    text += page.get_text()
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text

    def extract_email(self) -> str:
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        matches = re.findall(email_pattern, self.text)
        return matches[0] if matches else ""

    def extract_phone(self) -> str:
        phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        matches = re.findall(phone_pattern, self.text)
        return matches[0] if matches else ""

    def extract_entities(self):
        doc = nlp(self.text)
        entities = {"PERSON": [], "ORG": [], "GPE": []}
        for ent in doc.ents:
            if ent.label_ in entities:
                if ent.text not in entities[ent.label_]:
                    entities[ent.label_].append(ent.text)
        return entities

    def parse(self) -> dict:
        return {
            "email": self.extract_email(),
            "phone": self.extract_phone(),
            "entities": self.extract_entities(),
            "raw_text_length": len(self.text)
        }

if __name__ == "__main__":
    # Example usage
    pass
