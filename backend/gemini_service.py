import os
import socket
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPICallError, ResourceExhausted, InvalidArgument, Unauthenticated, DeadlineExceeded

class GeminiAPIException(Exception):
    """
    Custom exception for Gemini API errors that maps to HTTP status codes and user-friendly messages.
    """
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)

def classify_and_raise_exception(e: Exception):
    err_msg = str(e)
    
    # 1. Quota / Billing Exhausted (429)
    if isinstance(e, ResourceExhausted) or "429" in err_msg or "credits are depleted" in err_msg.lower() or "quota" in err_msg.lower():
        raise GeminiAPIException(503, "Gemini API quota or billing credits are exhausted.")
        
    # 2. Invalid API Key (Authentication / InvalidArgument if key format or value is wrong)
    if isinstance(e, Unauthenticated) or "API_KEY_INVALID" in err_msg or "key not valid" in err_msg.lower() or "api key" in err_msg.lower():
        raise GeminiAPIException(503, "Gemini API key is invalid.")
        
    # 3. Connection Timeout
    if isinstance(e, DeadlineExceeded) or "timeout" in err_msg.lower() or "deadline" in err_msg.lower() or isinstance(e, socket.timeout):
        raise GeminiAPIException(503, "Gemini service temporarily unavailable.")
        
    # 4. Other exceptions (Do not expose raw Google messages)
    raise GeminiAPIException(500, "Gemini generation error occurred.")

class GeminiService:
    """
    Service layer for interacting with Google's Gemini API.
    Used for advanced resume parsing, extraction, and JD matching.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key, transport="rest")
        
    def generate_content(self, prompt: str) -> str:
        """
        Sends a prompt to the Gemini model.
        """
        if not self.api_key:
            raise GeminiAPIException(
                status_code=503,
                detail="Gemini API is unavailable. Please configure GEMINI_API_KEY on the backend server."
            )
            
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt, request_options={"timeout": 30.0})
            if response and response.text:
                return response.text
            raise Exception("Empty response received from Gemini.")
        except Exception as e:
            print(f"Gemini API error logged: {e}")
            classify_and_raise_exception(e)
