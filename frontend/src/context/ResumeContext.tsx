import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: Array<{ degree: string; institution: string; year: string }>;
  experience: Array<{ role: string; company: string; duration: string; description: string }>;
  projects: Array<{ name: string; description: string }>;
}

export interface HeatmapItem {
  section: string;
  score: number;
  status: 'Strong' | 'Moderate' | 'Weak';
  description: string;
}

export interface RadarChartData {
  programming: number;
  ai_ml: number;
  web_development: number;
  databases: number;
  communication: number;
}

export interface TimelineItem {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  action: string;
  atsGain: number;
  description: string;
}

export interface Insights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  timeline: TimelineItem[];
}

export interface AnalysisData {
  profile: Profile;
  insights: Insights;
  heatmap: HeatmapItem[];
  radar_chart: RadarChartData;
}

export interface ATSData {
  ats_score: number;
  breakdown: {
    formatting: number;
    sections: number;
    contact_info: number;
    skills_match: number;
    experience_impact: number;
  };
}

export interface JDMatchData {
  match_percentage: number;
  missing_keywords: string[];
  suggestions: string[];
}

export interface HistoryItem {
  id: string;
  filename: string;
  uploadDate: string;
  analysisData: AnalysisData;
  atsData: ATSData;
  jdMatchData?: JDMatchData | null;
}

interface ResumeContextType {
  uploadedFile: File | null;
  analysisData: AnalysisData | null;
  atsData: ATSData | null;
  jdMatchData: JDMatchData | null;
  isLoading: boolean;
  isJdMatching: boolean;
  error: string | null;
  errorType: '404' | '500' | 'offline' | 'upload_fail' | null;
  history: HistoryItem[];
  activeResumeId: string | null;
  uploadAndAnalyze: (file: File) => Promise<boolean>;
  matchJobDescription: (jobDescription: string) => Promise<void>;
  clearState: () => void;
  switchResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, newName: string) => void;
  generateCoverLetter: (tone: 'professional' | 'bold' | 'technical', jobDescription: string) => Promise<string>;
  generateInterviewQuestions: (difficulty: 'Easy' | 'Medium' | 'Hard') => Promise<any[]>;
  sendChatMessage: (message: string, history: Array<{role: 'user' | 'assistant', content: string}>) => Promise<string>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const API_BASE = 'http://localhost:8000';

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [atsData, setAtsData] = useState<ATSData | null>(null);
  const [jdMatchData, setJdMatchData] = useState<JDMatchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJdMatching, setIsJdMatching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'404' | '500' | 'offline' | 'upload_fail' | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  const uploadControllerRef = useRef<AbortController | null>(null);
  const matchControllerRef = useRef<AbortController | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('resume-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HistoryItem[];
        setHistory(parsed);
        if (parsed.length > 0) {
          const first = parsed[0];
          setActiveResumeId(first.id);
          setAnalysisData(first.analysisData);
          setAtsData(first.atsData);
          setJdMatchData(first.jdMatchData || null);
          setUploadedFile(new File([], first.filename, { type: 'application/pdf' }));
        }
      } catch (e) {
        console.error('Error parsing resume history from localStorage', e);
      }
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('resume-history', JSON.stringify(newHistory));
  };

  const clearState = () => {
    setUploadedFile(null);
    setAnalysisData(null);
    setAtsData(null);
    setJdMatchData(null);
    setError(null);
    setErrorType(null);
    setActiveResumeId(null);
  };

  const uploadAndAnalyze = async (file: File): Promise<boolean> => {
    // Cancel any previous pending upload request
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setUploadedFile(file);
    setAnalysisData(null);
    setAtsData(null);
    setJdMatchData(null);

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit.");
      setErrorType("upload_fail");
      setIsLoading(false);
      return false;
    }

    const formData = new FormData();
    formData.append('file', file);

    const controller = new AbortController();
    uploadControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const analyzeResponse = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      if (!analyzeResponse.ok) {
        if (analyzeResponse.status === 404) throw new Error("API_404");
        throw new Error("API_500");
      }
      const analysisJson = await analyzeResponse.json();

      const atsResponse = await fetch(`${API_BASE}/ats-score`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      if (!atsResponse.ok) {
        throw new Error("API_500");
      }
      const atsJson = await atsResponse.json();

      clearTimeout(timeoutId);

      setAnalysisData(analysisJson);
      setAtsData(atsJson);
      setJdMatchData(null);

      // Create new history item
      const uuid = Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
      const newItem: HistoryItem = {
        id: uuid,
        filename: file.name,
        uploadDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        analysisData: analysisJson,
        atsData: atsJson,
        jdMatchData: null
      };

      const updatedHistory = [newItem, ...history];
      saveHistory(updatedHistory);
      setActiveResumeId(newItem.id);
      return true;

    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        console.log('Upload request aborted.');
        return false;
      }

      console.warn('Backend server unreachable or returned error.', err);

      setError("FastAPI server unavailable. Please start the backend server.");
      setErrorType("offline");
      setUploadedFile(null);
      setAnalysisData(null);
      setAtsData(null);
      setJdMatchData(null);
      return false;
    } finally {
      if (uploadControllerRef.current === controller) {
        uploadControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const matchJobDescription = async (jobDescription: string) => {
    // Cancel any previous pending JD match request
    if (matchControllerRef.current) {
      matchControllerRef.current.abort();
    }

    if (!uploadedFile || !activeResumeId) {
      setError("Please upload a resume first.");
      return;
    }

    setIsJdMatching(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('job_description', jobDescription);

    const controller = new AbortController();
    matchControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${API_BASE}/jd-match`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("API_500");
      }

      const matchJson = await response.json() as JDMatchData;
      setJdMatchData(matchJson);

      const updatedHistory = history.map(item => {
        if (item.id === activeResumeId) {
          return { ...item, jdMatchData: matchJson };
        }
        return item;
      });
      saveHistory(updatedHistory);

      clearTimeout(timeoutId);

    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        console.log('JD match request aborted.');
        return;
      }

      console.warn('Backend server error or unreachable for JD Match.', err);
      
      setError("FastAPI server unavailable. Please start the backend server.");
      setErrorType("offline");
      setJdMatchData(null);
    } finally {
      if (matchControllerRef.current === controller) {
        matchControllerRef.current = null;
        setIsJdMatching(false);
      }
    }
  };

  const generateCoverLetter = async (tone: 'professional' | 'bold' | 'technical', jobDescription: string): Promise<string> => {
    if (!analysisData) {
      throw new Error("No active resume analysis data found.");
    }
    const response = await fetch(`${API_BASE}/generate-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile: analysisData.profile,
        job_description: jobDescription,
        tone: tone
      })
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || "FastAPI cover letter generation failed.");
    }
    const data = await response.json();
    return data.cover_letter;
  };

  const generateInterviewQuestions = async (difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<any[]> => {
    if (!analysisData) {
      throw new Error("No active resume analysis data found.");
    }
    const response = await fetch(`${API_BASE}/generate-interview-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile: analysisData.profile,
        difficulty: difficulty
      })
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || "FastAPI interview questions generation failed.");
    }
    const data = await response.json();
    return data;
  };

  const sendChatMessage = async (message: string, historyList: Array<{role: 'user' | 'assistant', content: string}>): Promise<string> => {
    if (!analysisData) {
      throw new Error("No active resume analysis data found.");
    }
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile: analysisData.profile,
        message: message,
        history: historyList.map(h => ({ role: h.role, content: h.content }))
      })
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || "FastAPI chat query failed.");
    }
    const data = await response.json();
    return data.response;
  };

  const switchResume = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setActiveResumeId(id);
      setAnalysisData(item.analysisData);
      setAtsData(item.atsData);
      setJdMatchData(item.jdMatchData || null);
      setUploadedFile(new File([], item.filename, { type: 'application/pdf' }));
      setError(null);
      setErrorType(null);
    }
  };

  const deleteResume = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    saveHistory(updatedHistory);
    if (activeResumeId === id) {
      if (updatedHistory.length > 0) {
        switchResume(updatedHistory[0].id);
      } else {
        clearState();
      }
    }
  };

  const renameResume = (id: string, newName: string) => {
    const updatedHistory = history.map(h => {
      if (h.id === id) {
        return { ...h, filename: newName };
      }
      return h;
    });
    saveHistory(updatedHistory);
    if (activeResumeId === id) {
      setUploadedFile(new File([], newName, { type: 'application/pdf' }));
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        uploadedFile,
        analysisData,
        atsData,
        jdMatchData,
        isLoading,
        isJdMatching,
        error,
        errorType,
        history,
        activeResumeId,
        uploadAndAnalyze,
        matchJobDescription,
        clearState,
        switchResume,
        deleteResume,
        renameResume,
        generateCoverLetter,
        generateInterviewQuestions,
        sendChatMessage
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
