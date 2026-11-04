import React from 'react';
import { Film, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  apiMode: 'render' | 'simulation';
  onToggleApiMode: (mode: 'render' | 'simulation') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  apiMode,
  onToggleApiMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272a] bg-[#0f0f10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 items-center justify-center rounded bg-[#F5C518] px-2 text-xs font-black tracking-tighter text-black">
              IMDb
            </span>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              ML Predictor <span className="text-xs font-semibold text-[#F5C518] hidden sm:inline">SVM</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <a
            href="#formulario"
            className="hover:text-[#F5C518] transition-colors whitespace-nowrap shrink-0"
          >
            Formulário
          </a>
          <a
            href="#presets"
            className="hover:text-[#F5C518] transition-colors whitespace-nowrap shrink-0"
          >
            Filmes Clássicos
          </a>
          <a
            href="#svm-info"
            className="hover:text-[#F5C518] transition-colors whitespace-nowrap shrink-0"
          >
            Como Funciona o SVM
          </a>
          <a
            href="#historico"
            className="hover:text-[#F5C518] transition-colors whitespace-nowrap shrink-0"
          >
            Histórico
          </a>
        </nav>

        {/* Zone 3: Primary Action & Mode Switch */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Alternador de Modo de Execução */}
          <div className="hidden sm:flex items-center rounded-lg bg-[#18181b] p-1 border border-[#27272a]">
            <button
              type="button"
              onClick={() => onToggleApiMode('render')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                apiMode === 'render'
                  ? 'bg-[#F5C518] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Executa chamadas HTTP reais para a API do Render"
            >
              API Render
            </button>
            <button
              type="button"
              onClick={() => onToggleApiMode('simulation')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                apiMode === 'simulation'
                  ? 'bg-neutral-800 text-[#F5C518] font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Execução offline instantânea calculada pelo modelo SVM local"
            >
              SVM Local
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#3f3f46] bg-[#18181b] px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors hover:border-[#F5C518] hover:text-[#F5C518] whitespace-nowrap shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Padrão 1994</span>
          </button>
        </div>
      </div>
    </header>
  );
};
