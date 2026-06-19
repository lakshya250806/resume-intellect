import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';
import ATSBreakdown from '../charts/ATSBreakdown';
import SkillDistribution from '../charts/SkillDistribution';
import ResumeHeatmap from '../components/ResumeHeatmap';
import ResumeRoadmap from '../components/ResumeRoadmap';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import InterviewGenerator from '../components/InterviewGenerator';
import {
  Mail,
  Phone,
  GraduationCap,
  FolderGit2,
  RefreshCw,
  FileText,
  Check,
  AlertTriangle,
  Lightbulb,
  CornerDownRight,
  Layers,
  Wrench,
  Share2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '../components/ui/skeleton';

export default function Dashboard() {
  const { analysisData, atsData, isLoading, clearState } = useResume();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tools'>('overview');
  const [shareCopied, setShareCopied] = useState(false);

  const handleReset = () => {
    clearState();
    navigate('/');
  };

  const handleShare = () => {
    if (!analysisData || !atsData) return;

    const payload = {
      profile: analysisData.profile,
      insights: analysisData.insights,
      ats_score: atsData.ats_score,
      breakdown: atsData.breakdown
    };

    try {
      const jsonStr = JSON.stringify(payload);
      const b64 = window.btoa(unescape(encodeURIComponent(jsonStr)));
      const shareUrl = `${window.location.origin}/share?d=${b64}`;
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy share URL", e);
    }
  };

  const handleExport = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-10 text-left animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-900/60 no-print">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Gauge card */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 min-h-[320px] flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3.5 w-48 rounded" />
            </div>
            <div className="flex justify-center py-4">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
          </div>

          {/* Strengths / Gaps */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </div>
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>

            <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </div>
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
          </div>
        </div>

        {/* Roadmap skeleton */}
        <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4 shadow-sm">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-4 w-96 rounded" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData || !atsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto py-12">
        <div className="p-4 rounded-2xl bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6 text-[#71717A] dark:text-zinc-500">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-medium tracking-tight text-[#09090B] dark:text-zinc-200 mb-2">Workspace Empty</h2>
        <p className="text-[#71717A] dark:text-zinc-500 text-xs font-light mb-8 leading-relaxed">
          Please upload your resume file on the landing page to populate details and generate an automated score report.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-medium bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-950 dark:border dark:border-zinc-800 dark:text-zinc-350 dark:hover:bg-zinc-900 transition-colors h-10 px-5"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const { profile, insights } = analysisData;
  const { ats_score, breakdown } = atsData;

  const scoreClass = ats_score >= 80 ? 'text-emerald-500' : ats_score >= 60 ? 'text-amber-500' : 'text-rose-500';
  const strokeColor = ats_score >= 80 ? '#10b981' : ats_score >= 60 ? '#f59e0b' : '#f43f5e';

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (ats_score / 100) * circumference;

  return (
    <div className="space-y-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-900/60 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900/40 text-[10px] font-medium text-[#71717A] dark:text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Ready Workspace</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-[#71717A] dark:text-zinc-500 font-light">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-400" /> {profile.email}</span>
            {profile.phone && (
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-400" /> {profile.phone}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Action buttons */}
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/20 text-[#71717A] dark:text-zinc-400 hover:bg-[#F4F4F5] hover:text-[#09090B] dark:hover:text-zinc-250 transition-all h-9 px-4 active:scale-[0.98] shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            {shareCopied ? 'Link Copied!' : 'Share Link'}
          </button>

          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/20 text-[#71717A] dark:text-zinc-400 hover:bg-[#F4F4F5] hover:text-[#09090B] dark:hover:text-zinc-250 transition-all h-9 px-4 active:scale-[0.98] shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>

          {/* Tab Selection */}
          <div className="flex p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/20">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                activeTab === 'overview' 
                  ? 'bg-white text-[#09090B] dark:bg-zinc-800/80 dark:text-zinc-100 shadow-sm' 
                  : 'text-[#71717A] hover:text-[#09090B] dark:text-zinc-500 dark:hover:text-zinc-350'
              }`}
              aria-label="Overview tab"
            >
              <Layers className="w-3.5 h-3.5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                activeTab === 'tools' 
                  ? 'bg-white text-[#09090B] dark:bg-zinc-800/80 dark:text-zinc-100 shadow-sm' 
                  : 'text-[#71717A] hover:text-[#09090B] dark:text-zinc-500 dark:hover:text-zinc-350'
              }`}
              aria-label="AI Tools tab"
            >
              <Wrench className="w-3.5 h-3.5" />
              AI Tools
            </button>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/20 text-[#71717A] dark:text-zinc-450 hover:bg-[#F4F4F5] hover:text-[#09090B] dark:hover:text-zinc-250 transition-all h-9 px-4 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reupload
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-10 text-left"
          >
            {/* Print Header */}
            <div className="hidden print:block pb-6 border-b border-zinc-200">
              <h1 className="text-3xl font-bold">{profile.name} — ATS Analysis Report</h1>
              <p className="text-sm text-zinc-500 mt-1">{profile.email} | {profile.phone}</p>
            </div>            {/* 2. Top Bento Grid Layout (Asymmetrical) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* ATS Circle Gauge Card (Left, span 4) */}
              <div className="lg:col-span-4 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between min-h-[320px] relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-100 dark:bg-zinc-800/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex justify-between items-start no-print">
                  <div>
                    <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">ATS Rating</span>
                    <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Calculated section parsing probability</span>
                  </div>
                  <span className="text-[9px] text-emerald-650 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900 px-2 py-0.5 rounded font-normal">
                    Active Profile
                  </span>
                </div>

                {/* SVG Gauge */}
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
                      <motion.circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
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
                  Your resume scored well in key section layouts. Ready for automated parsing engines.
                </div>
              </div>

              {/* Strengths & Gaps (Right, span 8) */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Strengths Card */}
                <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                      <div className="p-1 rounded bg-emerald-55 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-200 uppercase tracking-widest">Strengths</h3>
                    </div>
                    
                    <div className="space-y-3.5">
                      {insights.strengths.slice(0, 3).map((strength, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <CornerDownRight className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-[#71717A] dark:text-zinc-500 font-light mt-6 border-t border-zinc-200 dark:border-zinc-900/30 pt-3">
                    High text-to-whitespace ratio detected
                  </div>
                </div>

                {/* Gaps Card */}
                <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                      <div className="p-1 rounded bg-rose-50 border border-rose-250 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-200 uppercase tracking-widest">Identified Gaps</h3>
                    </div>

                    <div className="space-y-3.5">
                      {insights.weaknesses.slice(0, 3).map((weakness, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <div className="h-1.5 w-1.5 rounded-full bg-rose-500/50 shrink-0 mt-1.5" />
                          <p className="text-xs text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">{weakness}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-[#71717A] dark:text-zinc-500 font-light mt-6 border-t border-zinc-200 dark:border-zinc-900/30 pt-3">
                    Adjust bullet details to bridge gaps
                  </div>
                </div>

              </div>

            </div>

            {/* 3. Resume Improvement Roadmap (Productization Phase 4) */}
            <ResumeRoadmap />

            {/* 4. Heatmap Quality Section (Phase 6) */}
            <ResumeHeatmap />

            {/* 5. AI Optimization Steps Roadmap */}
            <section className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                <div className="p-1 rounded bg-purple-55 border border-purple-200 text-purple-650 dark:bg-purple-950/20 dark:border-purple-950 dark:text-purple-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-300 uppercase tracking-widest">AI Action Roadmap</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {insights.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="space-y-3 relative group">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 flex items-center justify-center text-[10px] font-semibold text-[#71717A] dark:text-zinc-450 group-hover:border-purple-300 dark:group-hover:border-purple-500/40 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        0{i + 1}
                      </div>
                      <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest">Priority Action</span>
                    </div>
                    <p className="text-xs text-[#71717A] dark:text-zinc-455 font-light leading-relaxed pl-9 md:pl-0">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Dynamic Skill Cloud tags */}
            <section className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="pb-4 border-b border-zinc-200 dark:border-zinc-900/60 mb-5">
                <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Core Skill Cloud</span>
                <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Dynamically parsed tags matching technical indexes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-[#F4F4F5] dark:bg-zinc-900/30 text-[#71717A] dark:text-zinc-300 text-xs hover:border-zinc-350 dark:hover:border-zinc-700 hover:text-[#09090B] dark:hover:text-white hover:bg-white transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* 7. Charts Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 page-break">
              <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="pb-4 border-b border-zinc-200 dark:border-zinc-900/60 mb-6">
                  <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Structural Breakdown</span>
                  <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Grading of formatting syntax & contact parameters</span>
                </div>
                <ATSBreakdown data={breakdown} />
              </div>

              <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="pb-4 border-b border-zinc-200 dark:border-zinc-900/60 mb-6">
                  <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Domain Coverage</span>
                  <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Technical weight classification</span>
                </div>
                <SkillDistribution radarData={analysisData.radar_chart} />
              </div>
            </div>

            {/* 8. Extracted Experience feeds & Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch page-break">
              
              {/* Work history */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                    <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Parsed Timeline Feed</span>
                  </div>
                  
                  <div className="relative border-l border-zinc-200 dark:border-zinc-900 pl-5 ml-2.5 space-y-8">
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="relative group">
                        <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-955 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition-colors" />
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                            <h4 className="text-xs font-semibold text-[#09090B] dark:text-zinc-200">{exp.role}</h4>
                            <span className="text-[10px] text-[#71717A] dark:text-zinc-500 font-light bg-[#F4F4F5] dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                              {exp.duration}
                            </span>
                          </div>
                          <p className="text-xs text-purple-600 dark:text-purple-400/80 font-medium">{exp.company}</p>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-500 leading-relaxed font-light pt-1">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education and Projects */}
              <div className="lg:col-span-5 space-y-8 flex flex-col">
                
                {/* Education */}
                <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex-grow shadow-sm hover:shadow-md transition-shadow">
                  <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900/60 mb-4">
                    <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Education details</span>
                  </div>
                  <div className="space-y-4">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="p-2 rounded-lg bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[#71717A] dark:text-zinc-400 mt-0.5">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#09090B] dark:text-zinc-200 text-xs">{edu.degree}</h4>
                          <p className="text-[#71717A] dark:text-zinc-500 text-xs mt-0.5">{edu.institution}</p>
                          <p className="text-[10px] text-[#A1A1AA] dark:text-zinc-600 mt-0.5">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex-grow shadow-sm hover:shadow-md transition-shadow">
                  <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900/60 mb-4">
                    <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Portfolio Projects</span>
                  </div>
                  <div className="space-y-4">
                    {profile.projects.map((proj, i) => (
                      <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-[#F4F4F5]/30 dark:bg-zinc-900/10 flex gap-3.5 items-start hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                        <div className="p-2 rounded-lg bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[#71717A] dark:text-zinc-400 mt-0.5 shrink-0">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#09090B] dark:text-zinc-200 text-xs truncate">{proj.name}</h4>
                          <p className="text-[#71717A] dark:text-zinc-550 text-xs mt-1 leading-relaxed font-light">{proj.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="tools"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start text-left"
          >
            {/* AI Cover Letter Generator */}
            <CoverLetterGenerator />

            {/* AI Mock Interview Preparator */}
            <InterviewGenerator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
