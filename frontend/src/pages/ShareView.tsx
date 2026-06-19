import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ATSBreakdown from '../charts/ATSBreakdown';
import SkillDistribution from '../charts/SkillDistribution';
import { useTheme } from '../context/ThemeContext';
import {
  Mail,
  Phone,
  Cpu,
  CornerDownRight,
  Check,
  AlertTriangle
} from 'lucide-react';

// Types for deserialization
interface SharedData {
  profile: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: Array<{ degree: string; institution: string; year: string }>;
    experience: Array<{ role: string; company: string; duration: string; description: string }>;
    projects: Array<{ name: string; description: string }>;
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  ats_score: number;
  breakdown: {
    formatting: number;
    sections: number;
    contact_info: number;
    skills_match: number;
    experience_impact: number;
  };
  radar_chart?: {
    programming: number;
    ai_ml: number;
    web_development: number;
    databases: number;
    communication: number;
  };
}

export default function ShareView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const dataParam = searchParams.get('d');
    if (!dataParam) {
      setError("No shared data payload found in the URL.");
      return;
    }

    try {
      // Decode Base64 UTF-8 string
      const decodedJson = decodeURIComponent(
        Array.prototype.map.call(
          window.atob(dataParam),
          (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      
      const parsed = JSON.parse(decodedJson) as SharedData;
      setSharedData(parsed);
    } catch (e) {
      console.error(e);
      setError("Shared report is invalid or corrupted.");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto py-12">
        <div className="p-4 rounded-2xl bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6 text-rose-600 dark:text-rose-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-medium tracking-tight text-[#09090B] dark:text-zinc-200 mb-2">{error}</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-100 dark:text-zinc-955 dark:hover:bg-zinc-200 transition-colors h-10 px-5"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!sharedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto py-12">
        <div className="relative flex items-center justify-center w-10 h-10 mb-4">
          <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 animate-ping opacity-75"></span>
          <div className="relative w-6 h-6 rounded-full border border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 animate-spin"></div>
        </div>
        <p className="text-[#71717A] dark:text-zinc-400 text-xs font-light">Retrieving shared report credentials...</p>
      </div>
    );
  }

  const { profile, insights, ats_score, breakdown } = sharedData;
  const scoreClass = ats_score >= 80 ? 'text-emerald-500' : ats_score >= 60 ? 'text-amber-500' : 'text-rose-500';
  const strokeColor = ats_score >= 80 ? '#10b981' : ats_score >= 60 ? '#f59e0b' : '#f43f5e';

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (ats_score / 100) * circumference;

  return (
    <div className="space-y-10 text-left pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-900/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900/40 text-[10px] font-medium text-[#71717A] dark:text-zinc-500 mb-3">
            <Cpu className="w-3.5 h-3.5 text-purple-655 dark:text-purple-400" />
            <span>Shared Read-Only Report</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#09090B] dark:text-zinc-100">{profile.name}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-[#71717A] dark:text-zinc-500 font-light">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-400" /> {profile.email}</span>
            {profile.phone && (
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-400" /> {profile.phone}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all h-9 px-4 active:scale-95 shadow-sm"
        >
          Create Your Own Report
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Circular SVG Gauge */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between min-h-[320px] relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">ATS Rating</span>
            <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Compliance rating grade</span>
          </div>

          <div className="flex justify-center items-center py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={theme === 'dark' ? '#18181b' : '#e4e4e7'}
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-semibold tracking-tight ${scoreClass}`}>{ats_score}</span>
                <span className="text-[9px] text-[#71717A] dark:text-zinc-500 uppercase font-semibold tracking-widest mt-0.5">Grade</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#71717A] dark:text-zinc-500 font-light leading-relaxed pt-2 border-t border-zinc-200 dark:border-zinc-900/40">
            Automated structure rating parsed using custom recruiter models.
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                <div className="p-1 rounded bg-emerald-55 border border-emerald-250 text-emerald-650 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-355 uppercase tracking-widest">Strengths</h3>
              </div>
              <div className="space-y-3.5">
                {insights.strengths.map((strength, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-655 shrink-0 mt-0.5" />
                    <p className="text-xs text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                <div className="p-1 rounded bg-rose-50 border border-rose-250 text-rose-600 dark:bg-rose-955/20 dark:border-rose-900/50 dark:text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-355 uppercase tracking-widest">Gaps</h3>
              </div>
              <div className="space-y-3.5">
                {insights.weaknesses.map((weakness, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500/50 shrink-0 mt-1.5" />
                    <p className="text-xs text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <section className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900/60 mb-5">
          <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-[#F4F4F5] dark:bg-zinc-900/30 text-[#71717A] dark:text-zinc-300 text-xs hover:border-zinc-350 dark:hover:border-zinc-700 transition-all cursor-default shadow-sm">{skill}</span>
          ))}
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <ATSBreakdown data={breakdown} />
        </div>
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <SkillDistribution radarData={sharedData.radar_chart} />
        </div>
      </div>
    </div>
  );
}
