import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import ErrorState from '../components/ui/ErrorState';
import { 
  Upload, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  TrendingUp, 
  Target, 
  Check,
  Award,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { uploadAndAnalyze, isLoading, error, errorType } = useResume();
  const navigate = useNavigate();
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword'
    ];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      setFileError('Supported formats: PDF or DOCX only.');
      return;
    }

    setFileError(null);
    setCurrentFile(file);
    try {
      const success = await uploadAndAnalyze(file);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const loadDemo = () => {
    const demoFile = new File(
      ["demo_content"], 
      "Jane_Doe_Resume_Senior_Frontend.pdf", 
      { type: "application/pdf" }
    );
    processFile(demoFile);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-24 space-y-32">
      
      {/* 1. Asymmetrical Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
        {/* Left Side Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-[#F4F4F5] text-[#71717A] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-350 text-xs font-normal shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Introducing Intelligent Parsing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-editorial text-zinc-900 dark:text-white"
          >
            Create resumes that <br />
            <span className="text-gradient">rank higher.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-550 dark:text-zinc-400 max-w-xl font-light leading-relaxed"
          >
            A high-fidelity parser and analyzer designed to dissect layout structure, extract hidden keywords, and measure compliance against recruiter algorithms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <a
              href="#upload-zone"
              className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-[#09090B] text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors h-11 px-5 shadow-sm"
            >
              Analyze Your Resume
              <ChevronRight className="w-4 h-4" />
            </a>
            <button
              onClick={loadDemo}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold border border-zinc-200 bg-white text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B] dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900/80 transition-colors h-11 px-5 shadow-sm hover:shadow disabled:opacity-50 disabled:pointer-events-none"
            >
              Explore Live Demo
              <ArrowRight className="w-3.5 h-3.5 text-zinc-550" />
            </button>
          </motion.div>
        </div>

        {/* Right Side - Custom Interactive Upload Zone */}
        <div id="upload-zone" className="lg:col-span-5 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 rounded-3xl blur-2xl -z-10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] bg-white dark:bg-zinc-950/40 shadow-sm hover:shadow-md backdrop-blur-md overflow-hidden ${
                isDragActive 
                  ? 'border-zinc-400 bg-zinc-50/50 dark:border-zinc-500 dark:bg-zinc-900/30 scale-[1.01]' 
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-900 dark:hover:border-zinc-800'
              }`}
            >
              <input
                type="file"
                id="resume-upload-input"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleFileInput}
                disabled={isLoading}
              />

              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-5 text-center">
                  <div className="relative flex items-center justify-center w-12 h-12">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-800 animate-ping opacity-75"></span>
                    <div className="relative w-8 h-8 rounded-full border border-zinc-700 border-t-zinc-300 animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-200 text-sm font-medium">Deconstructing resume structure...</p>
                    <p className="text-[11px] text-zinc-500 font-light">Parsing headers, experience hierarchies, and skill weights</p>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="resume-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-center group"
                >
                  <div className="p-3.5 rounded-xl bg-[#F4F4F5] border border-zinc-200 text-[#71717A] group-hover:text-[#09090B] group-hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200 dark:group-hover:border-zinc-700 transition-all duration-300 mb-4 shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-[#09090B] dark:text-zinc-200 mb-1">
                    Drop your resume file
                  </span>
                  <span className="text-xs text-[#71717A] dark:text-zinc-500 font-light mb-4">
                    or click to browse your directory
                  </span>
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-zinc-200 bg-[#F4F4F5] text-[10px] text-[#71717A] dark:border-zinc-900 dark:bg-zinc-900/30 dark:text-zinc-500 font-light shadow-sm">
                    <span>PDF</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span>DOCX</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span>Max 10MB</span>
                  </div>
                </label>
              )}
            </div>

            {/* Error notifications */}
            {(fileError || error) && (
              <div className="mt-4">
                {errorType ? (
                  <ErrorState
                    type={errorType}
                    title={errorType === 'offline' ? 'Connection Error' : errorType === 'upload_fail' ? 'Upload Refused' : 'Parser Failed'}
                    message={fileError || error || 'An error occurred during resume processing.'}
                    onRetry={currentFile ? () => processFile(currentFile) : undefined}
                  />
                ) : (
                  <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20 dark:text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                    <span>{fileError || error}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. Platform Statistics Section */}
      <section className="border-t border-zinc-200 dark:border-zinc-900/80 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Uptime SLA</span>
            <span className="text-2xl font-light text-[#09090B] dark:text-zinc-100 block font-editorial">99.98%</span>
            <span className="text-xs text-[#71717A] dark:text-zinc-550 font-light">Robust parsing servers</span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Analysis Time</span>
            <span className="text-2xl font-light text-[#09090B] dark:text-zinc-100 block font-editorial">&lt; 1.5s</span>
            <span className="text-xs text-[#71717A] dark:text-zinc-550 font-light">Instant compliance results</span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Security</span>
            <span className="text-2xl font-light text-[#09090B] dark:text-zinc-100 block font-editorial">AES-256</span>
            <span className="text-xs text-[#71717A] dark:text-zinc-550 font-light">Resumes deleted after session</span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest block">Match Uptime</span>
            <span className="text-2xl font-light text-[#09090B] dark:text-zinc-100 block font-editorial">100k+</span>
            <span className="text-xs text-[#71717A] dark:text-zinc-550 font-light">Profiles scanned globally</span>
          </div>
        </div>
      </section>

      {/* 3. Alternating Feature Sections */}
      <section className="space-y-48">
        
        {/* Feature 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-2 rounded-xl bg-[#F4F4F5] border border-zinc-200 text-[#71717A] dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 w-fit shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-white text-editorial">
              ATS Scoring Core
            </h3>
            <p className="text-sm text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">
              Verify how resume content aligns with standard parser logic. The engine grades spelling precision, section clarity, contact info syntax, and layout density to pinpoint structural failure points before you apply.
            </p>
            <ul className="space-y-3 pt-2 text-xs text-[#71717A] dark:text-zinc-550">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Structure & formatting grading</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Complete section header check</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Contact info syntactic verification</li>
            </ul>
          </div>
          {/* Visual */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest">Compliance metrics</span>
                <span className="text-xs font-semibold text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded border border-zinc-200 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-800">Scored Profile</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#71717A] dark:text-zinc-400 font-light">Formatting Precision</span>
                    <span className="text-[#09090B] dark:text-zinc-300 font-medium">85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F4F4F5] dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-purple-500/50 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#71717A] dark:text-zinc-400 font-light">Contact Info Completeness</span>
                    <span className="text-[#09090B] dark:text-zinc-300 font-medium">95%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F4F4F5] dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-emerald-500/50 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#71717A] dark:text-zinc-400 font-light">Skills Section Alignment</span>
                    <span className="text-[#09090B] dark:text-zinc-300 font-medium">65%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F4F4F5] dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-amber-500/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 (Alternating!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden order-last lg:order-first shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest">Job alignment matcher</span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900 px-2 py-0.5 rounded">High Compatibility</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full border-4 border-zinc-100 border-t-purple-500 dark:border-zinc-900 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-[#09090B] dark:text-zinc-200">82%</span>
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#09090B] dark:text-zinc-200 truncate">Senior Software Developer</h4>
                  <p className="text-[11px] text-[#71717A] dark:text-zinc-500 font-light truncate">Missing terms: Kubernetes, Docker, Go, GraphQL</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[10px] text-[#71717A] bg-[#F4F4F5] border border-zinc-200 dark:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 px-2 py-1 rounded">+ Kubernetes</span>
                <span className="text-[10px] text-[#71717A] bg-[#F4F4F5] border border-zinc-200 dark:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 px-2 py-1 rounded">+ Docker</span>
                <span className="text-[10px] text-[#71717A] bg-[#F4F4F5] border border-zinc-200 dark:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 px-2 py-1 rounded">+ Go</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-2 rounded-xl bg-[#F4F4F5] border border-zinc-200 text-[#71717A] dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 w-fit shadow-sm">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-white text-editorial">
              Keyword Gap Analysis
            </h3>
            <p className="text-sm text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">
              Target specific job listings with your credentials. Paste any requirement sheet to extract critical, missing technical skills and get immediate advice on how to integrate those exact terms organically.
            </p>
            <ul className="space-y-3 pt-2 text-xs text-[#71717A] dark:text-zinc-550">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Target job keyword parsing</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Semantic distance matching</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Suggestions for resume bullets</li>
            </ul>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-2 rounded-xl bg-[#F4F4F5] border border-zinc-200 text-[#71717A] dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 w-fit shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-white text-editorial">
              Qualitative Insights
            </h3>
            <p className="text-sm text-[#71717A] dark:text-zinc-400 font-light leading-relaxed">
              Our analyzer reviews qualitative aspects, noting key professional achievements, identifying missing sections, and highlighting where impact metrics (percentages, numbers) should be introduced.
            </p>
            <ul className="space-y-3 pt-2 text-xs text-[#71717A] dark:text-zinc-550">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Quantitative metric suggestion prompts</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Highlighting key professional strengths</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-450" /> Listing potential skill blindspots</li>
            </ul>
          </div>
          {/* Visual */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6 text-left">
              <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] font-bold text-[#71717A] dark:text-zinc-500 uppercase tracking-widest">Actionable feedback roadmap</span>
              </div>
              <div className="relative border-l border-zinc-250 dark:border-zinc-800 pl-4 ml-2 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-purple-500 border border-white dark:border-zinc-950" />
                  <h4 className="text-xs font-semibold text-[#09090B] dark:text-zinc-300">Integrate testing frameworks</h4>
                  <p className="text-[11px] text-[#71717A] dark:text-zinc-500 font-light mt-0.5">Add mentions of Vitest, Jest or Cypress in projects.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-emerald-500 border border-white dark:border-zinc-950" />
                  <h4 className="text-xs font-semibold text-[#09090B] dark:text-zinc-300">Quantify experience metrics</h4>
                  <p className="text-[11px] text-[#71717A] dark:text-zinc-500 font-light mt-0.5">Change "Improved load times" to "Accelerated load times by 22%".</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
