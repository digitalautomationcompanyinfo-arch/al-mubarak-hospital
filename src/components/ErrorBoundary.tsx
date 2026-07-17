import React, { Component, ErrorInfo, ReactNode } from "react";
import DynamicIcon from "./DynamicIcon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-beige-50 p-6" dir="rtl">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
            <div className="w-16 h-16 mx-auto mb-5 bg-rose-100 rounded-full flex items-center justify-center">
              <DynamicIcon name="AlertTriangle" size={28} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              عذراً، حدث خطأ غير متوقع
            </h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              نعتذر عن هذا الخلل التقني. يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                  تفاصيل تقنية
                </summary>
                <pre className="mt-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-burgundy-800 hover:bg-burgundy-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
