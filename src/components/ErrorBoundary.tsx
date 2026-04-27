import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4">Something went wrong</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We encountered an unexpected error while rendering this page. Please try returning home.
            </p>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-black font-black hover:bg-slate-200 transition-all"
            >
              <Home className="w-5 h-5" />
              Go Back Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
