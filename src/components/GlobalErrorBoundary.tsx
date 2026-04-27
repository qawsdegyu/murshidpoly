import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 font-sans">
          <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Runtime Error Detected</h2>
                <p className="text-slate-400">The application crashed during the render cycle.</p>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-red-500/20 overflow-auto max-h-[300px]">
              <div className="text-red-500 font-mono text-sm font-bold mb-2">
                Error: {this.state.error?.message || "Unknown error"}
              </div>
              <pre className="text-slate-500 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {this.state.error?.stack}
              </pre>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-black font-black hover:bg-slate-200 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 text-white font-black hover:bg-white/20 transition-all border border-white/10"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
