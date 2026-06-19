import { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Sparkles, ArrowRight, Eye, EyeOff, FileDown, Check, Copy, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  category: 'technical' | 'behavioral' | 'project' | 'hr';
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function InterviewGenerator() {
  const { generateInterviewQuestions } = useResume();
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setQuestions(null);
    setVisibleAnswers({});
    setGeneratorError(null);

    try {
      const generated = await generateInterviewQuestions(difficulty) as Question[];
      setQuestions(generated);
    } catch (err: any) {
      console.error(err);
      setGeneratorError(err.message || "Failed to generate interview questions.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAnswer = (id: string) => {
    setVisibleAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyQuestion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportQuestions = () => {
    if (!questions) return;
    const textContent = questions.map((q, i) => 
      `Question ${i + 1} [${q.category.toUpperCase()} - ${q.difficulty}]\nQ: ${q.question}\nA: ${q.answer}\n\n`
    ).join('');

    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Interview_Questions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-400 uppercase tracking-widest block">AI Interview Prep</span>
          <span className="text-xs text-[#71717A] dark:text-zinc-300 font-light mt-0.5 block">Generate targeted mock interviews tailored to your stack</span>
        </div>

        {/* Export Button */}
        {questions && (
          <button
            onClick={exportQuestions}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 text-[#71717A] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-zinc-205 transition-all flex items-center gap-1.5 text-[10px] font-semibold uppercase shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export TXT
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-900">
            {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  difficulty === d 
                    ? 'bg-white text-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm' 
                    : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all h-9 px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-zinc-500 active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-800 dark:border-t-zinc-400 rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Questions
              </>
            )}
          </button>
        </div>

        {generatorError && (
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{generatorError}</span>
          </div>
        )}

        {/* Questions list */}
        {questions && (
          <div className="space-y-4 pt-2">
            {questions.map((q) => (
              <div key={q.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-[#F4F4F5]/30 dark:bg-zinc-950/40 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 text-[9px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 shadow-sm">
                      {q.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest ${
                      q.difficulty === 'Easy' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/25 dark:border-emerald-900 dark:text-emerald-450' :
                      q.difficulty === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/25 dark:border-amber-900 dark:text-amber-450' :
                      'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/25 dark:border-rose-900 dark:text-rose-450'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="text-[#71717A] hover:text-[#09090B] dark:text-zinc-500 dark:hover:text-zinc-300 p-0.5 rounded"
                      title={visibleAnswers[q.id] ? "Hide Answer Guidance" : "Show Answer Guidance"}
                    >
                      {visibleAnswers[q.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyQuestion(q.question, q.id)}
                      className="text-[#71717A] hover:text-[#09090B] dark:text-zinc-500 dark:hover:text-zinc-300 p-0.5 rounded"
                      title="Copy Question"
                    >
                      {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#09090B] dark:text-zinc-200 leading-relaxed">
                  {q.question}
                </p>

                {visibleAnswers[q.id] && (
                  <div className="mt-2.5 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/60 text-[11px] text-[#71717A] dark:text-zinc-400 font-light leading-relaxed whitespace-pre-wrap shadow-sm">
                    <div className="text-[10px] font-bold text-[#71717A] dark:text-zinc-550 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Suggested Answer Strategy
                    </div>
                    {q.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
