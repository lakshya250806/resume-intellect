import { useResume } from '../context/ResumeContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function ResumeHeatmap() {
  const { analysisData, atsData } = useResume();

  if (!analysisData || !atsData) return null;

  const sections = analysisData.heatmap || [];

  const getStatusColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-950', dot: 'bg-emerald-500', label: 'Strong', text: 'text-emerald-600 dark:text-emerald-500' };
    if (score >= 60) return { bg: 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-950', dot: 'bg-amber-500', label: 'Moderate', text: 'text-amber-600 dark:text-amber-500' };
    return { bg: 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-950', dot: 'bg-rose-500', label: 'Weak', text: 'text-rose-600 dark:text-rose-500' };
  };

  return (
    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Quality heat-map</span>
        <span className="text-xs text-[#71717A] dark:text-zinc-300 font-light mt-0.5 block">Automated confidence weights per resume component</span>
      </div>

      <div className="space-y-4">
        {sections.map((sec, i) => {
          const status = getStatusColor(sec.score);
          return (
            <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-[#F4F4F5]/30 dark:bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#09090B] dark:text-zinc-200">{sec.section}</span>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${status.bg}`}>
                    <span className={`h-1 w-1 rounded-full ${status.dot}`} />
                    {sec.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-zinc-500 font-light leading-relaxed">Automated parsing and analysis criteria</p>
                <div className="text-[10px] text-[#71717A] dark:text-zinc-350 font-normal flex items-start gap-1.5 pt-1.5 border-t border-zinc-200 dark:border-zinc-900/50 mt-1.5">
                  {sec.score >= 80 ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  )}
                  <span>{sec.description}</span>
                </div>
              </div>

              {/* Confidence metric indicator */}
              <div className="flex items-baseline gap-1 self-end md:self-center">
                <span className={`text-2xl font-bold tracking-tight ${status.text}`}>{sec.score}</span>
                <span className="text-[10px] text-[#71717A] dark:text-zinc-400 font-light">/100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
