import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('La Plume Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#092256] via-[#163673] to-[#092256] p-4 font-sans selection:bg-brand-coral selection:text-white">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl border border-slate-100/10 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-amber-400 to-brand-coral" />
            
            {/* La Plume logo */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
              🪶
            </div>
            
            <h1 className="font-display text-2xl font-extrabold text-[#092256] tracking-tight mb-3">
              Oups! Quelque chose s'est mal passé.
            </h1>
            
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              La Plume a rencontré une erreur inattendue. Ne vous inquiétez pas — votre progression est sauvegardée.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#092256] hover:bg-[#163673] text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Recharger la page ↻
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-white hover:bg-slate-50 text-[#092256] border-2 border-slate-100 hover:border-slate-200 font-extrabold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Retour au tableau de bord
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-8 font-medium">
              Si le problème persiste, contactez{' '}
              <a href="mailto:hello@laplume.africa" className="text-brand-coral font-bold hover:underline">
                hello@laplume.africa
              </a>
            </p>
          </div>
        </div>
      );
    }

    const { children } = (this as any).props as Props;
    return children;
  }
}

export default ErrorBoundary;
