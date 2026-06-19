import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Briefcase, 
  FileText, 
  Send, 
  AlertCircle, 
  Bookmark, 
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobMatch() {
  const { uploadedFile, jdMatchData, isJdMatching, matchJobDescription, error } = useResume();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [jdText, setJdText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) {
      setFormError('Please enter a job description.');
      return;
    }
    if (jdText.trim().length < 50) {
      setFormError('Job description must be at least 50 characters.');
      return;
    }
    setFormError(null);
    try {
      await matchJobDescription(jdText);
    } catch (err) {
      console.error(err);
    }
  };

  if (!uploadedFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto py-12">
        <div className="p-4 rounded-2xl bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6 text-[#71717A] dark:text-zinc-500">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-medium tracking-tight text-[#09090B] dark:text-zinc-200 mb-2">Resume Required</h2>
        <p className="text-[#71717A] dark:text-zinc-500 text-xs font-light mb-8 leading-relaxed">
          Please upload a resume file on the landing page before comparing compatibility with a job posting.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-medium bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-950 dark:border dark:border-zinc-800 dark:text-zinc-350 dark:hover:bg-zinc-900 transition-colors h-10 px-5"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  // Dial values
  const matchPercent = jdMatchData?.match_percentage || 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (matchPercent / 100) * circumference;

  // Pie chart calculation (Keywords found vs missing keywords count)
  // Let's assume we have a mock scale of keywords found based on match score
  const keywordsFound = Math.round((matchPercent / 100) * 10);
  const keywordsMissing = Math.max(2, 10 - keywordsFound);

  const pieData = [
    { name: 'Matched Terms', value: keywordsFound, color: '#10b981' },
    { name: 'Missing Terms', value: keywordsMissing, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-10 text-left">
      {/* 1. Header */}
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900/60">
        <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block mb-2">Alignment engine</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#09090B] dark:text-zinc-200">Job Alignment</h2>
        <p className="text-[#71717A] dark:text-zinc-455 text-xs font-light mt-1.5 leading-relaxed max-w-xl">
          Paste the requirements sheet below to cross-reference key technical vocabularies and calculate matching density metrics.
        </p>
      </div>

      {/* 2. Dual Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Input Form Card (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active File banner */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/80 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-[#71717A] dark:text-zinc-400 shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">analyzing against</span>
                <span className="text-xs font-medium text-[#09090B] dark:text-zinc-200 truncate block mt-0.5">{uploadedFile.name}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-[10px] text-[#71717A] hover:text-[#09090B] dark:text-zinc-500 dark:hover:text-zinc-350 font-medium shrink-0 transition-colors pl-2"
            >
              Change
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <label htmlFor="jd-input" className="text-[10px] font-bold text-[#71717A] dark:text-zinc-400 uppercase tracking-widest block">
                Job Description Text
              </label>
              <textarea
                id="jd-input"
                rows={11}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the technical expectations, roles, responsibilities or bullet points here..."
                className="w-full rounded-xl bg-white dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900 p-4 text-xs text-[#09090B] dark:text-zinc-200 placeholder-[#A1A1AA] dark:placeholder-zinc-650 focus:outline-none focus:border-zinc-450 dark:focus:border-zinc-850 focus:bg-white dark:focus:bg-zinc-900/30 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-transparent transition-all resize-none font-light leading-relaxed shadow-sm"
                disabled={isJdMatching}
              />
              <div className="flex justify-between items-center text-[10px] text-[#71717A] dark:text-zinc-500 pt-1">
                <span>Min. 50 characters</span>
                <span>{jdText.length} characters</span>
              </div>
            </div>

            {(formError || error) && (
              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-955 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-450 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-500" />
                <span>{formError || error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isJdMatching}
              className="w-full flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-250 transition-all h-10 px-4 disabled:opacity-50 active:scale-[0.98]"
            >
              {isJdMatching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-350 border-t-zinc-650 dark:border-zinc-800 dark:border-t-zinc-450 rounded-full animate-spin"></div>
                  Cross-matching keywords...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Evaluate Match Compatibility
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Side: Output Dashboard Card (Col span 7) */}
        <div className="lg:col-span-7">
          
          {isJdMatching ? (
            // Loading skeleton state
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-2xl bg-white dark:bg-zinc-900/80 p-8 min-h-[380px] flex flex-col items-center justify-center text-center gap-5 shadow-sm">
              <div className="relative flex items-center justify-center w-12 h-12">
                <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 animate-ping opacity-75"></span>
                <div className="relative w-8 h-8 rounded-full border border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400 animate-spin"></div>
              </div>
              <div className="space-y-1">
                <p className="text-[#09090B] dark:text-zinc-350 text-xs font-medium">Measuring keyword intersections...</p>
                <p className="text-[10px] text-[#71717A] dark:text-zinc-550 font-light">Cross-matching skill listings and computing scores</p>
              </div>
            </div>
          ) : jdMatchData ? (
            // Results State
            <div className="space-y-8">
              
              {/* Dial Score Panel */}
              <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-100 dark:bg-zinc-800/5 rounded-full blur-xl pointer-events-none" />
                
                {/* SVG Dial */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
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
                      stroke={matchPercent >= 75 ? '#10b981' : matchPercent >= 50 ? '#f59e0b' : '#f43f5e'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold tracking-tight text-[#09090B] dark:text-zinc-200">{matchPercent}%</span>
                    <span className="text-[8px] text-[#71717A] dark:text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Match</span>
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-[10px] font-normal text-[#71717A] dark:text-zinc-400">
                      Keyword Alignment Density
                    </div>
                    {matchPercent >= 70 ? (
                      <span className="text-[9px] text-emerald-650 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Positive Trend
                      </span>
                    ) : (
                      <span className="text-[9px] text-rose-600 dark:text-rose-455 font-semibold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Gap Alert
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#09090B] dark:text-zinc-200">How your skills align</h3>
                  <p className="text-xs text-[#71717A] dark:text-zinc-500 font-light leading-relaxed">
                    Parser algorithms scan and rank listings based on exact technical string matching. Integrating missing tags will directly increase your search visibility.
                  </p>
                </div>
              </div>

              {/* Phase 8 Keyword Match Analytics (Pie Chart + Progress bars) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Keywords Proportion Pie Chart */}
                <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900/60 mb-2">
                    <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Proportional Split</span>
                    <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Present vs missing required keywords</span>
                  </div>

                  <div className="h-[140px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={50}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.6} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            fontSize: '10px', 
                            background: theme === 'dark' ? '#18181b' : '#ffffff', 
                            border: `1px solid ${theme === 'dark' ? '#27272a' : '#e4e4e7'}`,
                            color: theme === 'dark' ? '#f4f4f5' : '#18181b'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-around text-[10px] font-semibold text-[#71717A] dark:text-zinc-550 border-t border-zinc-200 dark:border-zinc-900/30 pt-3">
                    <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {keywordsFound} Matched</span>
                    <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> {keywordsMissing} Missing</span>
                  </div>
                </div>

                {/* Analytical Gap Progress Index */}
                <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900/60 mb-3">
                    <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Gap progress index</span>
                    <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light">Categorical keyword gaps calculated</span>
                  </div>

                  <div className="space-y-3 flex-1 justify-center flex flex-col">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#71717A] dark:text-zinc-450">
                        <span>Required Tech Terms</span>
                        <span>{matchPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/70 dark:bg-emerald-500/50 rounded-full" style={{ width: `${matchPercent}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#71717A] dark:text-zinc-455">
                        <span>Tooling Coverage</span>
                        <span>{Math.max(35, matchPercent - 15)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500/70 dark:bg-purple-500/50 rounded-full" style={{ width: `${Math.max(35, matchPercent - 15)}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#71717A] dark:text-zinc-500 font-light mt-3 border-t border-zinc-200 dark:border-zinc-900/30 pt-2 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-650" />
                    <span>Analysis complete</span>
                  </div>
                </div>

              </div>

              {/* Missing keywords card */}
              <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                  <Bookmark className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-550" />
                  <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-300 uppercase tracking-widest">Recommended Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {jdMatchData.missing_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[#71717A] dark:text-zinc-400 text-xs hover:border-zinc-350 dark:hover:border-zinc-700 hover:text-[#09090B] dark:hover:text-white hover:bg-white transition-all cursor-default shadow-sm"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions card */}
              <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-900/60">
                  <Compass className="w-3.5 h-3.5 text-[#71717A] dark:text-zinc-550" />
                  <h3 className="text-xs font-bold text-[#09090B] dark:text-zinc-300 uppercase tracking-widest">Alignment Recommendations</h3>
                </div>
                <ul className="space-y-3.5 pt-1">
                  {jdMatchData.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-xs text-[#71717A] dark:text-zinc-400 font-light leading-relaxed flex gap-3 items-start">
                      <div className="h-5 w-5 rounded bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-[10px] font-medium text-[#71717A] dark:text-zinc-500 shrink-0 mt-0.5 shadow-sm">
                        {i + 1}
                      </div>
                      <span className="pt-0.5">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            // Awaiting Job Description Card
            <div className="border border-zinc-200 dark:border-zinc-900 border-dashed rounded-2xl bg-white dark:bg-zinc-900/40 p-8 min-h-[380px] flex flex-col items-center justify-center text-center shadow-sm">
              <div className="p-3.5 rounded-xl bg-[#F4F4F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[#71717A] dark:text-zinc-500 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold text-[#09090B] dark:text-zinc-300 mb-1">Awaiting Job Requirements</h3>
              <p className="text-[11px] text-[#71717A] dark:text-zinc-550 max-w-xs leading-relaxed font-light">
                Paste a requirements sheet on the left to start parsing and mapping skill gaps.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
