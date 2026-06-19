import { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Sparkles, Copy, FileDown, Check, AlertCircle } from 'lucide-react';

export default function CoverLetterGenerator() {
  const { generateCoverLetter } = useResume();
  const [jdText, setJdText] = useState('');
  const [tone, setTone] = useState<'professional' | 'bold' | 'technical'>('professional');
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jdText.trim()) return;
    setIsGenerating(true);
    setCoverLetter(null);
    setGeneratorError(null);

    try {
      const letter = await generateCoverLetter(tone, jdText);
      setCoverLetter(letter);
    } catch (err: any) {
      console.error(err);
      setGeneratorError(err.message || "Failed to generate cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsTxt = () => {
    if (!coverLetter) return;
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Cover_Letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">AI Document Writer</span>
        <span className="text-xs text-[#71717A] dark:text-zinc-400 font-light mt-0.5 block">Generate structured cover letters using profile metadata</span>
      </div>

      <div className="space-y-4">
        {/* Form controls */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#71717A] dark:text-zinc-400 uppercase tracking-widest block">Job Details / Role Specifications</label>
          <textarea
            rows={4}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste target job requirements, company name, or core description details..."
            className="w-full rounded-xl bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 p-3.5 text-xs text-[#09090B] dark:text-zinc-200 placeholder-[#A1A1AA] dark:placeholder-zinc-650 focus:outline-none focus:border-zinc-450 dark:focus:border-zinc-800 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-transparent transition-all resize-none font-light shadow-sm"
          />
        </div>

        {/* Tone Selector & Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-900">
            {(['professional', 'bold', 'technical'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  tone === t 
                    ? 'bg-white text-[#09090B] dark:bg-zinc-850 dark:text-zinc-100 shadow-sm' 
                    : 'text-[#71717A] hover:text-[#09090B] dark:text-zinc-500 dark:hover:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jdText.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-[#09090B] text-white hover:bg-[#18181b] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all h-9 px-4 disabled:opacity-50 active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-800 dark:border-t-zinc-400 rounded-full animate-spin"></div>
                Drafting letter...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {generatorError && (
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-350 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{generatorError}</span>
          </div>
        )}

        {/* Render Cover Letter */}
        {coverLetter && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-2.5">
              <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest">Letter Preview</span>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-800 text-[#71717A] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-zinc-250 transition-all flex items-center gap-1.5 text-[10px] shadow-sm"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-450" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={exportAsTxt}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-800 text-[#71717A] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-zinc-250 transition-all flex items-center gap-1.5 text-[10px] shadow-sm"
                >
                  <FileDown className="w-3 h-3" />
                  <span>TXT</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-[#F4F4F5]/30 dark:bg-zinc-900/20 text-xs text-[#09090B] dark:text-zinc-300 font-light leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto font-mono">
              {coverLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
