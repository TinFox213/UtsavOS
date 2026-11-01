// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard React Error Boundary preventing catastrophic UI crashes
 * with accessible recovery controls and diagnostics.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Retain error state in memory for UI presentation without console smells
    void errorInfo;
    void error;
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6"
      >
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">System Safeguard Activated</h2>
          <p className="text-sm text-slate-400">
            An isolated component exception occurred. Application state has been shielded to prevent data loss.
          </p>
          {this.state.error && (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-rose-300 text-left overflow-x-auto">
              {this.state.error.message}
            </div>
          )}
          <button
            type="button"
            onClick={this.handleReset}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium py-2.5 px-4 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Recover Session
          </button>
        </div>
      </div>
    );
  }
}
