import React from 'react';
import { MovieFormData } from '../types/prediction';
import {
  Calendar,
  Clock,
  Award,
  Users,
  Sparkles,
  Loader2,
  Film,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface PredictionFormProps {
  formData: MovieFormData;
  onChange: (field: keyof MovieFormData, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
  apiMode: 'render' | 'simulation';
  loadingSeconds: number;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  apiMode,
  loadingSeconds,
}) => {
  // Conversão de minutos para horas e minutos
  const formatDuration = (mins: number) => {
    if (!mins || isNaN(mins)) return '0m';
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return hours > 0 ? `${hours}h ${remainder}m` : `${remainder}m`;
  };

  // Cor do Metascore no estilo oficial Metacritic
  const getMetascoreColor = (score: number) => {
    if (score >= 61) return 'bg-[#66cc33] text-black';
    if (score >= 40) return 'bg-[#ffcc33] text-black';
    return 'bg-[#ff0000] text-white';
  };

  return (
    <div
      id="formulario"
      className="rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Detalhe de iluminação sutil no topo */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5C518]/60 to-transparent" />

      <div className="flex items-center justify-between pb-5 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27272a] text-[#F5C518]">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Parâmetros do Filme
            </h2>
            <p className="text-xs text-neutral-400">
              Insira as 4 variáveis para alimentar o classificador SVM
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors disabled:opacity-50"
          title="Restaurar padrão (Um Sonho de Liberdade - 1994)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Padrão</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        {/* Campo 1: Ano de Lançamento (year) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-year"
              className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-[#F5C518]" />
              Ano de Lançamento <span className="text-neutral-500 font-mono">(year)</span>
            </label>
            <span className="text-[11px] font-mono text-neutral-400">
              Faixa histórica: 1920 – 2030
            </span>
          </div>
          <div className="relative">
            <input
              id="input-year"
              type="number"
              min={1920}
              max={2030}
              required
              value={formData.year}
              onChange={(e) => onChange('year', parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-[#3f3f46] bg-[#121214] px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:border-[#F5C518] focus:outline-none focus:ring-1 focus:ring-[#F5C518] transition-colors tabular-nums"
              placeholder="1994"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Ano de estreia nos cinemas. Padrão inicial: <strong className="text-neutral-400">1994</strong>.
          </p>
        </div>

        {/* Campo 2: Duração em Minutos (runtime) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-runtime"
              className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-[#F5C518]" />
              Duração em Minutos <span className="text-neutral-500 font-mono">(runtime)</span>
            </label>
            <span className="text-xs font-medium text-[#F5C518] font-mono tabular-nums">
              {formatDuration(formData.runtime)}
            </span>
          </div>
          <div className="relative">
            <input
              id="input-runtime"
              type="number"
              min={30}
              max={500}
              required
              value={formData.runtime}
              onChange={(e) => onChange('runtime', parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-[#3f3f46] bg-[#121214] px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:border-[#F5C518] focus:outline-none focus:ring-1 focus:ring-[#F5C518] transition-colors tabular-nums"
              placeholder="142"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Duração total do longa. Filmes com mais de 130m têm forte presença no Top 250.
          </p>
        </div>

        {/* Campo 3: Meta Score da Crítica (metascore) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-metascore"
              className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-[#F5C518]" />
              Meta Score da Crítica <span className="text-neutral-500 font-mono">(metascore)</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded font-mono ${getMetascoreColor(
                  formData.metascore
                )}`}
              >
                {formData.metascore}
              </span>
              <span className="text-[11px] text-neutral-400">/ 100</span>
            </div>
          </div>
          <div className="relative">
            <input
              id="input-metascore"
              type="number"
              min={0}
              max={100}
              required
              value={formData.metascore}
              onChange={(e) => onChange('metascore', parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-[#3f3f46] bg-[#121214] px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:border-[#F5C518] focus:outline-none focus:ring-1 focus:ring-[#F5C518] transition-colors tabular-nums"
              placeholder="80"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Média ponderada da crítica no Metacritic (0 a 100). Padrão: <strong className="text-neutral-400">80</strong>.
          </p>
        </div>

        {/* Campo 4: Número de Votos no IMDb (votes) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-votes"
              className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-[#F5C518]" />
              Número de Votos no IMDb <span className="text-neutral-500 font-mono">(votes)</span>
            </label>
            <span className="text-xs font-mono text-neutral-300 tabular-nums">
              {Number(formData.votes || 0).toLocaleString('pt-BR')} votos
            </span>
          </div>
          <div className="relative">
            <input
              id="input-votes"
              type="number"
              min={1}
              required
              value={formData.votes}
              onChange={(e) => onChange('votes', parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-[#3f3f46] bg-[#121214] px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:border-[#F5C518] focus:outline-none focus:ring-1 focus:ring-[#F5C518] transition-colors tabular-nums"
              placeholder="2343110"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Engajamento da comunidade de cinéfilos. Padrão inicial: <strong className="text-neutral-400">2.343.110</strong>.
          </p>
        </div>

        {/* Botão de Envio Principal */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group flex items-center justify-center gap-2.5 rounded-lg bg-[#F5C518] px-5 py-3.5 text-sm font-bold text-black shadow-lg transition-all hover:bg-[#E2B616] hover:shadow-[#F5C518]/20 focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:ring-offset-2 focus:ring-offset-[#18181b] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>
                  Processando Predição no Modelo SVM...
                  {loadingSeconds > 2 && (
                    <span className="ml-1 text-xs font-mono">({loadingSeconds}s)</span>
                  )}
                </span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>Submeter Predição ao SVM</span>
              </>
            )}
          </button>

          {/* Dica amigável de cold-start do Render */}
          {isLoading && loadingSeconds >= 5 && apiMode === 'render' && (
            <p className="mt-2.5 text-center text-xs text-amber-400/90 animate-pulse">
              Aguardando a instância do Render... Como é um plano gratuito, o servidor pode levar até 30s para inicializar após períodos de inatividade.
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              Destino: <code className="text-neutral-300 font-mono">imdb-back-end.onrender.com</code>
            </span>
            <span className="text-neutral-500 font-mono">POST / application/json</span>
          </div>
        </div>
      </form>
    </div>
  );
};
