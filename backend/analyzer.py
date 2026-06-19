import os
import re

class ResumeAnalyzer:
    """
    Analyzes resume text to extract structured components and qualitative insights.
    """
    def __init__(self):
        pass

    def analyze(self, raw_text: str, filename: str = "") -> dict:
        """
        Analyzes raw resume text and outputs structured profile + feedback.
        
        :param raw_text: Extracted text from the parser.
        :param filename: Optional filename to handle demo/test cases.
        :return: Dict containing extracted profile and analysis insights.
        """
        from parser import extract_resume_info
        
        is_demo = raw_text.strip() == "demo_content"
        
        # Check if we should serve a rich sample profile for testing/demo purposes
        if is_demo:
            # Software Engineer Profile (Default Demo)
            info = {
                "name": "Marcus Vance",
                "email": "marcus.vance@devhq.net",
                "phone": "+1 (555) 234-5678",
                "skills": ["Java", "Spring Boot", "Python", "SQL", "REST APIs", "Docker", "Kubernetes", "Git", "GitHub", "Linux"],
                "education": ["B.S. in Computer Science | University of Washington | 2020"],
                "experience": ["Software Engineer | SystemScale Industries | 2020 - Present | Engineered distributed Java Spring Boot APIs handling 10k+ concurrent threads. Optimized database read indexing in Postgres and deployed Docker clusters on Kubernetes."],
                "projects": ["Distributed Task Scheduler | Built a background queue processor in Java using RabbitMQ for async messaging."]
            }
        else:
            # Real resume parsing
            info = extract_resume_info(raw_text)

        # Build dynamic strengths, weaknesses, and recommendations based on the parsed info
        skills_count = len(info["skills"])
        exp_count = len(info["experience"])
        proj_count = len(info["projects"])
        edu_count = len(info["education"])
        
        strengths = []
        weaknesses = []
        recommendations = []
        
        if skills_count >= 8:
            strengths.append(f"Strong inventory of technical skills ({skills_count} identified).")
        else:
            weaknesses.append("Technical skill count is relatively low.")
            recommendations.append("Expand the technical skills section to include modern frameworks.")
            
        if exp_count > 0:
            strengths.append(f"Active professional history with {exp_count} mapped career highlights.")
        else:
            weaknesses.append("Professional history section is sparse or not clearly parsed.")
            recommendations.append("Detail previous roles, internships or freelance work using active verbs.")
            
        if proj_count >= 2:
            strengths.append(f"Demonstrates practical execution across {proj_count} portfolio projects.")
        else:
            weaknesses.append("Limited project listings found on the resume.")
            recommendations.append("Add at least 2 detailed project summaries highlighting your technical stack.")

        if edu_count > 0:
            strengths.append("Education history and credentials are clear.")
        else:
            weaknesses.append("Education credentials not clearly identified.")
            recommendations.append("Ensure university degrees and graduation years are listed.")
            
        # Add default items if list is empty
        if not strengths:
            strengths.append("Basic contact details are present.")
        if not weaknesses:
            weaknesses.append("Ready for ATS submission.")
        if not recommendations:
            recommendations.append("Incorporate quantitative achievements in experience bullets.")
            
        # Structure education as dict list for frontend compatibility
        formatted_education = []
        for edu_line in info["education"]:
            parts = edu_line.split('|')
            degree = parts[0].strip() if parts else edu_line
            inst = parts[1].strip() if len(parts) > 1 else "Listed Institution"
            year = parts[2].strip() if len(parts) > 2 else "N/A"
            formatted_education.append({
                "degree": degree,
                "institution": inst,
                "year": year
            })
            
        # Structure experience as dict list for frontend compatibility
        formatted_experience = []
        for exp_line in info["experience"]:
            parts = exp_line.split('|')
            role = parts[0].strip() if parts else exp_line
            company = parts[1].strip() if len(parts) > 1 else "Listed Company"
            duration = parts[2].strip() if len(parts) > 2 else "N/A"
            description = parts[3].strip() if len(parts) > 3 else exp_line
            formatted_experience.append({
                "role": role,
                "company": company,
                "duration": duration,
                "description": description
            })
            
        # Structure projects as dict list for frontend compatibility
        formatted_projects = []
        for proj_line in info["projects"]:
            parts = proj_line.split('|')
            name = parts[0].strip() if parts else proj_line
            desc = parts[1].strip() if len(parts) > 1 else proj_line
            formatted_projects.append({
                "name": name,
                "description": desc
            })

        # Calculate breakdown scores for Heatmap & Radar Chart directly on the backend
        has_email = bool(info.get("email"))
        has_phone = bool(info.get("phone"))
        contact_score = 100 if (has_email and has_phone) else 70 if (has_email or has_phone) else 30
        skills_score = min(40 + skills_count * 6, 100)
        
        has_metrics = False
        for exp_item in formatted_experience:
            desc = exp_item.get("description", "")
            if re.search(r'\d+%|\d+\s*k|\$\d+', desc):
                has_metrics = True
                break
        exp_score = min(50 + exp_count * 15 + (15 if has_metrics else 0), 100)
        proj_score = min(50 + proj_count * 25, 100)
        edu_score = min(50 + edu_count * 25, 100)
        
        # Heatmap calculations
        heatmap = [
            {
                "section": "Summary",
                "score": contact_score,
                "status": "Strong" if contact_score >= 80 else "Moderate" if contact_score >= 60 else "Weak",
                "description": "Email and telephone are present and in standard format." if (has_email and has_phone) else "Contact details are partially parsed."
            },
            {
                "section": "Skills",
                "score": skills_score,
                "status": "Strong" if skills_score >= 80 else "Moderate" if skills_score >= 60 else "Weak",
                "description": f"Rich inventory of {skills_count} skills parsed." if skills_count >= 8 else "Expand skills list to increase ATS keyword matching density."
            },
            {
                "section": "Experience",
                "score": exp_score,
                "status": "Strong" if exp_score >= 80 else "Moderate" if exp_score >= 60 else "Weak",
                "description": "Quantitative metrics (e.g. percentages or counts) are successfully parsed in your work history." if has_metrics else "Action metrics missing. Quantify achievements (e.g. 'boosted speed by 25%')."
            },
            {
                "section": "Projects",
                "score": proj_score,
                "status": "Strong" if proj_score >= 80 else "Moderate" if proj_score >= 60 else "Weak",
                "description": "Multiple projects are detailed with structural descriptions." if proj_count >= 2 else "Recommend adding at least 2 distinct projects."
            },
            {
                "section": "Education",
                "score": edu_score,
                "status": "Strong" if edu_score >= 80 else "Moderate" if edu_score >= 60 else "Weak",
                "description": "Degree credentials and parsing brackets are complete." if edu_count > 0 else "Verify education section headers are readable."
            }
        ]

        # Radar Chart calculations
        lowercase_skills = [s.lower() for s in info.get("skills", [])]
        def count_matches(keywords):
            return sum(1 for s in lowercase_skills if any(kw in s for kw in keywords))
            
        prog_val = min(30 + count_matches(['python', 'javascript', 'typescript', 'java', 'go', 'cpp', 'ruby', 'c#', 'rust']) * 20, 100)
        aiml_val = min(25 + count_matches(['gemini', 'diffusion', 'ai', 'ml', 'openai', 'llm', 'learning', 'tensorflow', 'pytorch', 'nlp']) * 25, 100)
        web_val = min(35 + count_matches(['react', 'html', 'css', 'tailwind', 'vue', 'angular', 'next', 'fastapi', 'node', 'express', 'rest', 'api']) * 15, 100)
        db_val = min(30 + count_matches(['sql', 'postgres', 'mysql', 'mongo', 'redis', 'graphql', 'prisma', 'database', 'query']) * 20, 100)
        comm_val = min(40 + count_matches(['agile', 'scrum', 'git', 'github', 'collaboration', 'lead', 'team', 'doc', 'write', 'english']) * 15, 100)

        radar_chart = {
            "programming": prog_val,
            "ai_ml": aiml_val,
            "web_development": web_val,
            "databases": db_val,
            "communication": comm_val
        }

        # Timeline/Roadmap items computed on backend
        timeline = []
        if exp_score < 80:
            timeline.append({
                "id": "r1",
                "priority": "Critical",
                "action": "Quantify work accomplishments",
                "atsGain": 8,
                "description": "Add quantitative metrics (e.g. percentages, counts, dollar values) to your work history bullet points."
            })
        if skills_score < 80:
            timeline.append({
                "id": "r2",
                "priority": "High",
                "action": "Address technical keyword gaps",
                "atsGain": 10,
                "description": "Integrate recommended missing toolings into your project profiles."
            })
        if contact_score < 90:
            timeline.append({
                "id": "r4",
                "priority": "High",
                "action": "Improve contact metadata headers",
                "atsGain": 5,
                "description": "Label phone numbers and email addresses explicitly with standard headers (e.g. 'Email:') for parser indexing."
            })
        if not timeline:
            timeline.append({
                "id": "r_default",
                "priority": "Low",
                "action": "Refine professional summary details",
                "atsGain": 3,
                "description": "Optimize words in your introduction paragraph to match recruiter keyword searches."
            })

        return {
            "profile": {
                "name": info.get("name", ""),
                "email": info.get("email", ""),
                "phone": info.get("phone", ""),
                "skills": info.get("skills", []),
                "education": formatted_education,
                "experience": formatted_experience,
                "projects": formatted_projects
            },
            "insights": {
                "strengths": strengths,
                "weaknesses": weaknesses,
                "recommendations": recommendations,
                "timeline": timeline
            },
            "heatmap": heatmap,
            "radar_chart": radar_chart
        }
