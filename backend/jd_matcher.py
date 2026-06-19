class JobDescriptionMatcher:
    """
    Matches a parsed resume structure against a job description.
    """
    def __init__(self):
        pass

    def match(self, resume_text: str, job_description: str) -> dict:
        """
        Calculates compatibility of resume with job description.
        
        :param resume_text: Plain text of the resume.
        :param job_description: Text of the job description.
        :return: Dict containing match percentage, missing keywords, and suggestions.
        """
        lowercase_resume = resume_text.lower()
        lowercase_jd = job_description.lower()
        
        from parser import SKILL_KEYWORDS
        
        jd_skills = []
        for skill in SKILL_KEYWORDS:
            if skill.lower() in lowercase_jd:
                jd_skills.append(skill)
                
        resume_skills = []
        for skill in SKILL_KEYWORDS:
            if skill.lower() in lowercase_resume:
                resume_skills.append(skill)
                
        matched = [s for s in jd_skills if s in resume_skills]
        missing = [s for s in jd_skills if s not in resume_skills]
        
        if jd_skills:
            match_percentage = round((len(matched) / len(jd_skills)) * 100)
            suggestions = []
            for kw in missing:
                suggestions.append(f"Consider integrating experience with {kw} to align with the job description.")
            if not suggestions:
                suggestions.append("Align your resume descriptions to highlight quantitative project metrics.")
        else:
            match_percentage = 0
            missing = []
            suggestions = [
                "No recognizable technical skills were found in the job description. Please paste a detailed job description containing standard technical keywords to evaluate match compatibility."
            ]
            
        return {
            "match_percentage": match_percentage,
            "missing_keywords": missing,
            "suggestions": suggestions
        }
