import { useResume } from '../context/ResumeContext';

interface RoadmapItem {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  action: string;
  atsGain: number;
  description: string;
}

export default function ResumeRoadmap() {
  const { atsData, analysisData } = useResume();

  if (!atsData || !analysisData) return null;

  const roadmap: RoadmapItem[] = (analysisData.insights.timeline || []) as RoadmapItem[];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400';
      case 'High':
        return 'bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400';
      case 'Medium':
        return 'bg-purple-50 dark:bg-purple-500/15 border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Optimization Path</span>
        <span className="text-xs text-[#71717A] dark:text-zinc-300 font-light mt-0.5 block">Visual roadmap to maximize ATS performance scoring</span>
      </div>

      <div className="space-y-4">
        {roadmap.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-[#F4F4F5]/30 dark:bg-zinc-955/40 flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
                <span className="text-xs font-semibold text-[#09090B] dark:text-zinc-200">{item.action}</span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">{item.description}</p>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 self-end sm:self-center">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900 px-2 py-1 rounded flex items-center gap-1">
                +{item.atsGain} ATS Points
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
