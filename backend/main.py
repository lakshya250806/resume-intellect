import os
import json
import uuid
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

# Load environment variables
load_dotenv(override=True)

# Import modules
from parser import ResumeParser
from analyzer import ResumeAnalyzer
from ats_score import ATSScorer
from jd_matcher import JobDescriptionMatcher
from gemini_service import GeminiService, GeminiAPIException

# Custom Exception for Upload validation
class UploadException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)

# Custom Exception for Rate Limiting
class RateLimitException(Exception):
    pass

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Backend service for analyzing resumes and matching them with job descriptions",
    version="1.0.0"
)

# Exception handlers
@app.exception_handler(GeminiAPIException)
async def gemini_api_exception_handler(request: Request, exc: GeminiAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "service": "gemini"}
    )

@app.exception_handler(UploadException)
async def upload_exception_handler(request: Request, exc: UploadException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "service": "upload"}
    )

@app.exception_handler(RateLimitException)
async def rate_limit_exception_handler(request: Request, exc: RateLimitException):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Rate limit exceeded. Please try again later.",
            "service": "rate_limit"
        }
    )

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "service": "parser"}
    )

@app.exception_handler(RuntimeError)
async def runtime_error_handler(request: Request, exc: RuntimeError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "service": "parser"}
    )

# Hardened CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Rate Limiter
class InMemoryRateLimiter:
    def __init__(self, requests_limit: int = 10, window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.client_records = {}

    def check_rate_limit(self, ip: str):
        now = time.time()
        if ip not in self.client_records:
            self.client_records[ip] = []
        self.client_records[ip] = [t for t in self.client_records[ip] if now - t < self.window_seconds]
        if len(self.client_records[ip]) >= self.requests_limit:
            raise RateLimitException()
        self.client_records[ip].append(now)

rate_limiter = InMemoryRateLimiter(requests_limit=10, window_seconds=60)

def enforce_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    rate_limiter.check_rate_limit(client_ip)

# Helper function to validate uploaded files
async def validate_and_read_file(file: UploadFile) -> bytes:
    if not file.filename:
        raise UploadException(status_code=400, detail="No filename provided")
        
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in {".pdf", ".docx"}:
        raise UploadException(status_code=400, detail="Only .pdf and .docx files are supported.")
        
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
        raise UploadException(
            status_code=413,
            detail="File size exceeds the maximum allowed limit."
        )
    return contents

# Initialize services
parser = ResumeParser()
analyzer = ResumeAnalyzer()
scorer = ATSScorer()
matcher = JobDescriptionMatcher()

# Initialize Gemini only if the key exists
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini = None
if GEMINI_API_KEY and GEMINI_API_KEY.strip():
    gemini = GeminiService(api_key=GEMINI_API_KEY)

import logging
logger = logging.getLogger("uvicorn")

@app.middleware("http")
async def structured_logging_middleware(request: Request, call_next):
    path = request.url.path
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    start_time = time.time()
    response = await call_next(request)
    execution_time = round((time.time() - start_time) * 1000, 2)
    
    target_endpoints = {
        "/upload", "/analyze", "/ats-score", "/jd-match", 
        "/generate-cover-letter", "/generate-interview-questions", "/chat"
    }
    
    if path in target_endpoints:
        logger.info(
            f"RequestID: {request_id} | Endpoint: {path} | Status: {response.status_code} | ExecutionTime: {execution_time}ms"
        )
        
    return response

@app.on_event("startup")
async def startup_event():
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        print("✓ Gemini initialized successfully", flush=True)
        logger.info("✓ Gemini initialized successfully")
    else:
        print("⚠ GEMINI_API_KEY missing", flush=True)
        logger.warning("⚠ GEMINI_API_KEY missing")

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic schemas
class CoverLetterRequest(BaseModel):
    profile: dict
    job_description: str
    tone: str

class InterviewRequest(BaseModel):
    profile: dict
    difficulty: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    profile: dict
    message: str
    history: List[ChatMessage]

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Resume Analyzer API"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "gemini_available": gemini is not None,
        "version": "1.0.0"
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts file upload (PDF/DOCX) and returns metadata.
    """
    contents = await validate_and_read_file(file)
    
    # Generate random UUID filename for storage and eliminate path traversal
    _, ext = os.path.splitext(file.filename.lower())
    safe_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
            
        # Parse resume
        parsed_data = parser.parse(contents, file.filename)
        
        return {
            "file_id": f"file-{uuid.uuid4()}",
            "filename": file.filename,
            "status": "uploaded",
            "parsed_metadata": {
                "file_type": parsed_data["file_type"],
                "file_size_bytes": parsed_data["file_size_bytes"]
            }
        }
    finally:
        # Cleanup file after parsing (successful, failure, or exception)
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Uploads a resume file and performs full structural and qualitative analysis.
    """
    contents = await validate_and_read_file(file)
    parsed_data = parser.parse(contents, file.filename)
    analysis_results = analyzer.analyze(parsed_data["extracted_text"], file.filename)
    
    return analysis_results

@app.post("/ats-score")
async def get_ats_score(file: UploadFile = File(...)):
    """
    Uploads a resume file and computes an ATS score & breakdown.
    """
    contents = await validate_and_read_file(file)
    parsed_data = parser.parse(contents, file.filename)
    analysis_results = analyzer.analyze(parsed_data["extracted_text"], file.filename)
    score_results = scorer.compute_score(analysis_results)
    
    return score_results

@app.post("/jd-match")
async def match_job_description(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Uploads a resume file and matches it against a job description.
    """
    contents = await validate_and_read_file(file)
    parsed_data = parser.parse(contents, file.filename)
    match_results = matcher.match(parsed_data["extracted_text"], job_description)
    
    return match_results

@app.post("/generate-cover-letter")
async def generate_cover_letter(req: CoverLetterRequest, request: Request):
    """
    Generates a cover letter based on the candidate's profile, tone, and job description.
    """
    enforce_rate_limit(request)
    if not gemini:
        raise GeminiAPIException(
            status_code=503,
            detail="Gemini API is unavailable. Please configure GEMINI_API_KEY on the backend server."
        )

    profile = req.profile
    job_description = req.job_description
    tone = req.tone

    prompt = f"""
    Generate a professional cover letter based on the following candidate details and target job description.
    
    Candidate details:
    Name: {profile.get('name', 'Candidate')}
    Email: {profile.get('email', '')}
    Phone: {profile.get('phone', '')}
    Skills: {', '.join(profile.get('skills', []))}
    Experience: {profile.get('experience', [])}
    Projects: {profile.get('projects', [])}
    
    Job description:
    {job_description}
    
    Tone requirement: {tone}
    
    Requirements:
    1. Do NOT use templates or simple string interpolation. Create a unique letter flowing naturally.
    2. Reference specific skills and experiences from the profile that match the job description.
    3. Do NOT include placeholders like [Your Name], [Company Name], or [Date]. Use the actual profile details or write realistic prose.
    """

    content = gemini.generate_content(prompt).strip()
    if not content:
        raise HTTPException(status_code=500, detail="Gemini failed to generate a response.")

    return {"cover_letter": content}

@app.post("/generate-interview-questions")
async def generate_interview_questions(req: InterviewRequest, request: Request):
    """
    Generates tailored interview questions based on the candidate's profile and difficulty level.
    """
    enforce_rate_limit(request)
    if not gemini:
        raise GeminiAPIException(
            status_code=503,
            detail="Gemini API is unavailable. Please configure GEMINI_API_KEY on the backend server."
        )

    profile = req.profile
    difficulty = req.difficulty

    prompt = f"""
    Generate exactly 4 custom interview preparation questions tailored for a candidate with the following profile.
    
    Candidate details:
    Skills: {', '.join(profile.get('skills', []))}
    Experience: {profile.get('experience', [])}
    Projects: {profile.get('projects', [])}
    
    Difficulty level: {difficulty}
    
    Generate:
    1. A Technical question related to the candidate's skills.
    2. A Project-based question related to the candidate's projects.
    3. A Behavioral question.
    4. An HR question.
    
    Return the response ONLY as a valid JSON array of objects. Do NOT wrap the JSON inside markdown blocks (e.g. ```json).
    The JSON structure must be exactly:
    [
      {{
        "id": "q1",
        "category": "technical",
        "question": "question text",
        "answer": "answer strategy guidance",
        "difficulty": "{difficulty}"
      }},
      ...
    ]
    """

    content = gemini.generate_content(prompt).strip()
    if not content:
        raise HTTPException(status_code=500, detail="Gemini failed to generate a response.")

    # Remove markdown code blocks if the model returned them
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    try:
        questions = json.loads(content)
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse generated interview questions as JSON: {e}. Output was: {content}"
        )

@app.post("/chat")
async def chat(req: ChatRequest, request: Request):
    """
    Maintains an active conversation with the candidate using the active resume details.
    """
    enforce_rate_limit(request)
    if not gemini:
        raise GeminiAPIException(
            status_code=503,
            detail="Gemini API is unavailable. Please configure GEMINI_API_KEY on the backend server."
        )

    profile = req.profile
    message = req.message
    history = req.history

    prompt = f"""
    You are an AI Resume Assistant. You help candidates optimize their profile based on their active resume details.
    
    Candidate Profile Context:
    Name: {profile.get('name', 'Candidate')}
    Email: {profile.get('email', '')}
    Phone: {profile.get('phone', '')}
    Skills: {', '.join(profile.get('skills', []))}
    Experience: {profile.get('experience', [])}
    Projects: {profile.get('projects', [])}
    
    Conversation History:
    """

    for msg in history:
        role_name = "User" if msg.role == "user" else "Assistant"
        prompt += f"{role_name}: {msg.content}\n"
        
    prompt += f"User: {message}\nAssistant: "

    content = gemini.generate_content(prompt).strip()
    if not content:
        raise HTTPException(status_code=500, detail="Gemini failed to generate a response.")

    return {"response": content}
