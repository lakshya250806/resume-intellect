import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error boundary catch:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#f4f4f5] p-6">
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto bg-zinc-900/50 border border-zinc-900 rounded-2xl">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 mb-4 text-rose-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Application Error</h3>
            <p className="text-[11px] text-zinc-500 font-light leading-relaxed mb-6">
              A critical rendering or component initialization error occurred: {this.state.error?.message || "Please reload the page."}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all h-9 px-4 active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
