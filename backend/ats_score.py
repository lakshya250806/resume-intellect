class ATSScorer:
    """
    Computes ATS match score based on resume structure, styling, and presence of standard sections.
    """
    def __init__(self):
        pass

    def compute_score(self, analyzed_data: dict) -> dict:
        """
        Calculates ATS scores based on completeness of analyzed profile.
        
        :param analyzed_data: Dictionary output from ResumeAnalyzer.
        :return: Dict containing overall ATS score and categorical breakdown.
        """
        profile = analyzed_data.get("profile", {})
        
        # 1. Contact Info Score
        has_email = bool(profile.get("email"))
        has_phone = bool(profile.get("phone"))
        if has_email and has_phone:
            contact_score = 100
        elif has_email or has_phone:
            contact_score = 70
        else:
            contact_score = 30
            
        # 2. Skills Match Score
        skills_len = len(profile.get("skills", []))
        skills_score = min(40 + skills_len * 6, 100)
        
        # 3. Experience Impact Score
        exp = profile.get("experience", [])
        has_metrics = False
        import re
        for e in exp:
            desc = e.get("description", "")
            if re.search(r'\d+%|\d+\s*k|\$\d+', desc):
                has_metrics = True
                break
        exp_score = min(50 + len(exp) * 15 + (15 if has_metrics else 0), 100)
        
        # 4. Sections Completeness Score
        sect_score = 50
        if profile.get("skills"):
            sect_score += 15
        if profile.get("experience"):
            sect_score += 15
        if profile.get("projects"):
            sect_score += 10
        if profile.get("education"):
            sect_score += 10
        sect_score = min(sect_score, 100)
        
        # 5. Formatting Score
        proj_len = len(profile.get("projects", []))
        edu_len = len(profile.get("education", []))
        formatting_score = min(65 + proj_len * 10 + edu_len * 10, 100)
        
        breakdown = {
            "formatting": formatting_score,
            "sections": sect_score,
            "contact_info": contact_score,
            "skills_match": skills_score,
            "experience_impact": exp_score
        }
        
        # Calculate overall weighted average score
        weights = {
            "formatting": 0.15,
            "sections": 0.20,
            "contact_info": 0.15,
            "skills_match": 0.30,
            "experience_impact": 0.20
        }
        
        overall_score = round(sum(breakdown[k] * weights[k] for k in weights))
        
        return {
            "ats_score": overall_score,
            "breakdown": breakdown
        }
