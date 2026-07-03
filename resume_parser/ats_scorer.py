import re

class ATSScorer:
    def __init__(self, resume_text: str, job_description: str):
        self.resume_text = resume_text.lower()
        self.job_description = job_description.lower()

    def _extract_keywords(self, text: str) -> set:
        # Simple keyword extraction (in production, use TF-IDF or spaCy)
        words = re.findall(r'\b\w+\b', text)
        stop_words = {"and", "the", "to", "of", "in", "for", "with", "on", "a", "an", "is", "as"}
        return set([w for w in words if w not in stop_words and len(w) > 2])

    def calculate_score(self) -> dict:
        resume_keywords = self._extract_keywords(self.resume_text)
        jd_keywords = self._extract_keywords(self.job_description)

        if not jd_keywords:
            return {"score": 0, "missing_keywords": []}

        matched_keywords = jd_keywords.intersection(resume_keywords)
        missing_keywords = list(jd_keywords.difference(resume_keywords))

        score = (len(matched_keywords) / len(jd_keywords)) * 100

        return {
            "score": round(score, 2),
            "matched_keywords": list(matched_keywords),
            "missing_keywords": missing_keywords
        }
