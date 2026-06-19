import { AlertOctagon, RefreshCw, WifiOff, FileX } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: '404' | '500' | 'offline' | 'upload_fail';
  onRetry?: () => void;
}

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred while processing your request.", 
  type = "500",
  onRetry 
}: ErrorStateProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'offline':
        return <WifiOff className="w-8 h-8 text-zinc-500" />;
      case 'upload_fail':
        return <FileX className="w-8 h-8 text-rose-500" />;
      default:
        return <AlertOctagon className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto my-12 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-850 mb-4 shrink-0">
        {getIcon()}
      </div>
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-[11px] text-zinc-500 font-light leading-relaxed mb-6">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all h-9 px-4 active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}
