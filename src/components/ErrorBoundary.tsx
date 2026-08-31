import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  errorStack?: string;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
    errorStack: '',
    showDetails: false
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('[HADEED ErrorBoundary Caught]:', error, errorInfo);
    this.setState({
      errorStack: errorInfo?.componentStack || error.stack || ''
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
      errorStack: '',
      showDetails: false
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen w-full bg-[#020617] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#030712] to-black text-foreground flex items-center justify-center p-4 md:p-8 font-['Cairo']">
          <div className="relative w-full max-w-4xl bg-card/65 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-elegant overflow-hidden group">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none transition-all duration-700 group-hover:bg-accent/15" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 blur-[120px] -ml-32 -mb-32 rounded-full pointer-events-none transition-all duration-700 group-hover:bg-red-500/10" />

            {/* Glowing Accent Top Bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500/20 via-accent/60 to-red-500/20" />

            <div className="p-8 md:p-14 space-y-10 relative z-10">
              {/* Header Icon */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-widest font-['Tajawal'] mb-1">
                  HADEED — المركز الهندسي لطلاب البلقاء
                </h1>
                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-accent/80 block mb-6">
                  AL-BALQA APPLIED UNIVERSITY
                </span>
              </div>

              {/* Bilingual Message Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-white/5 py-8">
                {/* Arabic Fallback Section */}
                <div className="space-y-4 text-right md:border-l md:border-white/5 md:pl-0 md:pr-8 rtl:text-right" dir="rtl">
                  <h2 className="text-xl font-black text-red-400">عذراً، واجه التطبيق خطأً غير متوقع! ⚠️</h2>
                  <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                    نعتذر عن ذلك! واجه التطبيق خطأً أثناء معالجة الصفحة أو تحميل أجزاء الشفرة (Chunk load failure). لا داعي للقلق، يمكنك استعادة التشغيل بنقرة زر.
                  </p>
                </div>

                {/* English Fallback Section */}
                <div className="space-y-4 text-left md:pl-8" dir="ltr">
                  <h2 className="text-xl font-black text-red-400">Oops, something went wrong! ⚠️</h2>
                  <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                    We apologize for the inconvenience. The application crashed due to an unexpected layout rendering or script load error. You can recover immediately.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-black text-base rounded-2xl hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-accent/20 cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5 animate-spin-slow" />
                  <span>إعادة المحاولة / Reload Hub</span>
                </button>

                <button
                  onClick={this.handleReset}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-surface/50 border border-white/10 hover:border-white/20 text-foreground font-black text-base rounded-2xl active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <Home className="w-5 h-5" />
                  <span>الصفحة الرئيسية / Return Home</span>
                </button>
              </div>

              {/* Advanced Debug Info Accordion */}
              <div className="border border-white/5 rounded-2xl bg-black/25 overflow-hidden">
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  className="w-full px-6 py-4 flex items-center justify-between text-muted-foreground hover:text-foreground text-sm font-bold transition-all bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-accent" />
                    <span>تفاصيل الخطأ التقنية (للمطورين) / Technical Details (For Devs)</span>
                  </div>
                  {this.state.showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {this.state.showDetails && (
                  <div className="p-6 border-t border-white/5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1 text-left" dir="ltr">
                      <span className="text-[10px] font-black text-red-400 tracking-wider uppercase">Error Message:</span>
                      <pre className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl text-xs font-mono text-red-400/90 overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorMessage}
                      </pre>
                    </div>

                    {this.state.errorStack && (
                      <div className="space-y-1 text-left" dir="ltr">
                        <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase">Component Stack Trace:</span>
                        <pre className="p-3 bg-slate-950/40 border border-white/5 rounded-xl text-[10px] font-mono text-slate-400 max-h-48 overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                          {this.state.errorStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
