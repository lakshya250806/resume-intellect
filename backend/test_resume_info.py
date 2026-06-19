import unittest
from parser import extract_resume_info

class TestResumeInfoExtraction(unittest.TestCase):

    def test_email_extraction(self):
        # Test standard email formats
        text1 = "Jane Doe\nEmail: jane.doe@example.com\nPhone: +1 555 123 4567"
        info1 = extract_resume_info(text1)
        self.assertEqual(info1["email"], "jane.doe@example.com")

        # Test email in different place
        text2 = "Send inquiries to test-candidate.dev_12@sub.domain.org or call us."
        info2 = extract_resume_info(text2)
        self.assertEqual(info2["email"], "test-candidate.dev_12@sub.domain.org")

        # Test no email present
        text3 = "No contact address listed here."
        info3 = extract_resume_info(text3)
        self.assertEqual(info3["email"], "")

    def test_phone_extraction(self):
        # Test Indian style formats
        text1 = "Candidate Name\n9876543210\nemail@test.com"
        info1 = extract_resume_info(text1)
        self.assertEqual(info1["phone"], "9876543210")

        text2 = "Contact: +91 9876543210"
        info2 = extract_resume_info(text2)
        self.assertEqual(info2["phone"], "+91 9876543210")

        text3 = "Call us: +91-98765-43210"
        info3 = extract_resume_info(text3)
        self.assertEqual(info3["phone"], "+91-98765-43210")

        # Test US/Intl style formats
        text4 = "Phone: +1 (555) 019-2834"
        info4 = extract_resume_info(text4)
        self.assertEqual(info4["phone"], "+1 (555) 019-2834")

        text5 = "Cell: 555-123-4567"
        info5 = extract_resume_info(text5)
        self.assertEqual(info5["phone"], "555-123-4567")

        # Test no phone present
        text6 = "Only text, no digits here."
        info6 = extract_resume_info(text6)
        self.assertEqual(info6["phone"], "")

    def test_name_inference(self):
        # Test clean name in first lines
        text1 = "Alice Cooper\nEmail: alice@cooper.net\nPhone: 1234567890"
        info1 = extract_resume_info(text1)
        self.assertEqual(info1["name"], "Alice Cooper")

        # Test name with bullets or special headers
        text2 = "  - Robert Downey Jr. \nSummary: Software engineer developer"
        info2 = extract_resume_info(text2)
        self.assertEqual(info2["name"], "Robert Downey Jr.")

        # Test fallback when headers exist first
        text3 = "RESUME\n\nVictor Von Doom\nSkills: C++, Linux"
        info3 = extract_resume_info(text3)
        self.assertEqual(info3["name"], "Victor Von Doom")

    def test_skill_extraction(self):
        # Test normal matching
        text1 = "Skills: Python, React, Docker, SQL, and C++"
        info1 = extract_resume_info(text1)
        self.assertEqual(info1["skills"], ["C++", "Docker", "Python", "React", "SQL"])

        # Test case insensitivity and boundaries
        text2 = "experienced python and typescript developer. used next.js with fastapi."
        info2 = extract_resume_info(text2)
        self.assertEqual(info2["skills"], ["FastAPI", "Next.js", "Python", "TypeScript"])

        # Test exclusion of partial matches (e.g. 'Java' in 'JavaScript')
        text3 = "Technologies: JavaScript, PyTorch, MongoDB"
        info3 = extract_resume_info(text3)
        self.assertEqual(info3["skills"], ["JavaScript", "MongoDB", "PyTorch"])
        self.assertNotIn("Java", info3["skills"])

    def test_education_extraction(self):
        text = (
            "EDUCATION\n"
            "Bachelor of Science in Computer Science - State University (2020)\n"
            "Master of Technology - Indian Institute of Technology (CGPA: 9.2)\n"
            "Random unrelated sentence that should not be extracted."
        )
        info = extract_resume_info(text)
        self.assertEqual(len(info["education"]), 2)
        self.assertIn("Bachelor of Science in Computer Science - State University (2020)", info["education"])
        self.assertIn("Master of Technology - Indian Institute of Technology (CGPA: 9.2)", info["education"])

    def test_experience_extraction(self):
        text = (
            "EXPERIENCE\n"
            "Worked as a Frontend Developer Intern at Innovate Tech\n"
            "Senior Systems Analyst at Cloud Company (2021-2023)\n"
            "This is just some random bullet description."
        )
        info = extract_resume_info(text)
        self.assertEqual(len(info["experience"]), 2)
        self.assertIn("Worked as a Frontend Developer Intern at Innovate Tech", info["experience"])
        self.assertIn("Senior Systems Analyst at Cloud Company (2021-2023)", info["experience"])

    def test_project_extraction(self):
        text = (
            "PROJECTS\n"
            "Built a full-stack AI Resume Analyzer using React\n"
            "Designed and developed a custom compiler for C++\n"
            "Unrelated sentence."
        )
        info = extract_resume_info(text)
        self.assertEqual(len(info["projects"]), 2)
        self.assertIn("Built a full-stack AI Resume Analyzer using React", info["projects"])
        self.assertIn("Designed and developed a custom compiler for C++", info["projects"])

if __name__ == '__main__':
    unittest.main()
