import React from 'react';
import { ApiResponse, ApiPayload, MovieFormData } from '../types/prediction';
import {
  Trophy,
  Film,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Code2,
  HelpCircle,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface ResultDisplayProps {
  result: ApiResponse | null;
  payload: ApiPayload | null;
  formData: MovieFormData;
  isLoading: boolean;
  error: string | null;
  isSimulated?: boolean;
  onRetry: () => void;
  onTryLocalSimulation: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  payload,
  formData,
  isLoading,
  error,
  isSimulated,
  onRetry,
  onTryLocalSimulation,
}) => {
  // Extrai número da probabilidade (ex: "85.5%" -> 85.5)
  const parseProbability = (probStr?: string) => {
    if (!probStr) return 0;
    const num = parseFloat(probStr.replace('%', ''));
    return isNaN(num) ? 0 : num;
  };

  const probValue = result ? parseProbability(result.probability) : 0;
  const isTop = result?.prediction === 1;

  // Estado 1: Carregando (Loading state com scanner cinematográfico)
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl flex flex-col items-center justify-center min-h-[460px] text-center relative overflow-hidden">
        {/* Radar beam animation */}
        <div className="w-24 h-24 rounded-full border-2 border-[#F5C518]/20 flex items-center justify-center relative mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#F5C518] border-t-transparent animate-spin" />
          <Film className="w-10 h-10 text-[#F5C518] animate-pulse" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Analisando Hiperplano SVM...
        </h3>
        <p className="text-xs text-neutral-400 max-w-sm mb-4">
          Avaliando dimensões vetoriais: Ano ({formData.year}), Duração ({formData.runtime}m), Metascore ({formData.metascore}) e Votos ({formData.votes.toLocaleString('pt-BR')}).
        </p>

        <div className="w-full max-w-xs bg-[#121214] h-1.5 rounded-full overflow-hidden border border-[#27272a]">
          <div className="h-full bg-gradient-to-r from-amber-500 via-[#F5C518] to-yellow-200 animate-pulse w-3/4 rounded-full" />
        </div>

        <span className="mt-4 text-[11px] font-mono text-neutral-500">
          POST https://imdb-back-end.onrender.com
        </span>
      </div>
    );
  }

  // Estado 2: Erro amigável
  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-[#1a1414] p-6 shadow-2xl flex flex-col justify-between min-h-[460px]">
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-red-900/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-950/80 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-200">
                Não foi possível obter resposta da API
              </h3>
              <p className="text-xs text-red-400/80 font-mono">
                Destino: imdb-back-end.onrender.com
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-[#140f0f] border border-red-900/30 text-xs text-red-300 leading-relaxed font-mono">
            {error}
          </div>

          <div className="mt-4 text-xs text-neutral-300 space-y-2">
            <p className="font-semibold text-neutral-200">Diagnóstico comum:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-xs">
              <li>
                <strong>Instância em repouso:</strong> O plano gratuito do Render desliga após inatividade e pode demorar 30 a 50 segundos para despertar.
              </li>
              <li>
                <strong>CORS do Navegador:</strong> Se o backend no Render não incluir cabeçalhos <code>Access-Control-Allow-Origin</code>, o navegador bloqueia a leitura direta da resposta.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-red-900/30 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 px-4 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Tentar Conexão Novamente
          </button>
          <button
            type="button"
            onClick={onTryLocalSimulation}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#F5C518] font-semibold py-2.5 px-4 text-xs transition-colors border border-[#3f3f46]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Executar no SVM Local (Instantâneo)
          </button>
        </div>
      </div>
    );
  }

  // Estado 3: Sucesso com Predição
  if (result) {
    return (
      <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl flex flex-col justify-between min-h-[460px] relative overflow-hidden">
        {/* Glow decorativo sutil de acordo com a predição */}
        <div
          className={`absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isTop ? 'bg-[#F5C518]' : 'bg-neutral-400'
          }`}
        />

        <div>
          {/* Header do Card de Resultado */}
          <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#F5C518]" />
              Classificação do Modelo SVM
            </span>
            <div className="flex items-center gap-2">
              {isSimulated && (
                <span className="text-[11px] font-mono bg-neutral-800 text-[#F5C518] px-2 py-0.5 rounded border border-neutral-700">
                  Modo Local
                </span>
              )}
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                200 OK
              </span>
            </div>
          </div>

          {/* Destaque Chamativo (Badge) */}
          <div className="mt-6">
            {isTop ? (
              <div className="rounded-2xl border-2 border-[#F5C518]/70 bg-gradient-to-b from-[#2a2207] to-[#1a1608] p-6 text-center shadow-2xl shadow-[#F5C518]/15 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5C518] text-black mb-3 shadow-lg shadow-[#F5C518]/30">
                  <Trophy className="w-8 h-8 fill-black" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#F5C518]/20 border border-[#F5C518]/50 text-[#F5C518] text-xs font-bold tracking-wide uppercase mb-2">
                  Prediction: 1
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {result.label || 'Top Filme (IMDb >= 8.0)'}
                </h3>
                <p className="mt-2 text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Excelente! Os atributos posicionam esta produção do lado positivo do hiperplano do SVM, com perfil histórico do seleto <strong>IMDb Top 250</strong>.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-700 bg-gradient-to-b from-[#222226] to-[#18181b] p-6 text-center shadow-xl relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 text-neutral-300 mb-3 border border-neutral-700">
                  <Film className="w-8 h-8" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold tracking-wide uppercase mb-2">
                  Prediction: 0
                </div>
                <h3 className="text-2xl font-bold text-neutral-200 tracking-tight">
                  {result.label || 'Filme Comum (IMDb < 8.0)'}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  O classificador determinou que estas métricas se enquadram na faixa regular da indústria cinematográfica (abaixo de 8.0).
                </p>
              </div>
            )}
          </div>

          {/* Medidor de Probabilidade */}
          <div className="mt-6 rounded-xl bg-[#121214] border border-[#27272a] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-[#F5C518]" />
                Confiança / Probabilidade
              </span>
              <span
                className={`text-base font-extrabold font-mono tabular-nums ${
                  isTop ? 'text-[#F5C518]' : 'text-neutral-200'
                }`}
              >
                {result.probability}
              </span>
            </div>

            <div className="w-full bg-[#1e1e24] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#2a2a32]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isTop
                    ? 'bg-gradient-to-r from-amber-500 via-[#F5C518] to-yellow-200 shadow-md shadow-[#F5C518]/30'
                    : 'bg-neutral-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, probValue))}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-mono text-neutral-500">
              <span>0% Incerto</span>
              <span>Margem do Hiperplano (50%)</span>
              <span>100% Certeza</span>
            </div>
          </div>
        </div>

        {/* Rodapé do resultado: Informações do Payload */}
        {payload && (
          <div className="mt-4 pt-3 border-t border-[#27272a] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>
              Payload: y: {payload.year} | r: {payload.runtime}m | m: {payload.metascore} | v:{' '}
              {(parseInt(payload.votes) / 1000).toFixed(0)}k
            </span>
            <span className="text-neutral-500">JSON Validado</span>
          </div>
        )}
      </div>
    );
  }

  // Estado 4: Estado Inicial (Empty State)
  return (
    <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl flex flex-col items-center justify-center min-h-[460px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#201d12] border border-[#F5C518]/30 flex items-center justify-center text-[#F5C518] mb-4 shadow-lg shadow-[#F5C518]/10">
        <Trophy className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">
        Aguardando Submissão
      </h3>
      <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-6">
        Preencha os campos ao lado ou selecione um benchmark de filme clássico para verificar se a produção ultrapassa o limiar de corte <strong>IMDb 8.0</strong>.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-left">
        <div className="p-3 rounded-lg bg-[#121214] border border-[#27272a]">
          <span className="block text-[10px] font-mono text-[#F5C518] uppercase">Top Filme (1)</span>
          <span className="text-xs text-neutral-300 font-medium">Nota IMDb ≥ 8.0</span>
        </div>
        <div className="p-3 rounded-lg bg-[#121214] border border-[#27272a]">
          <span className="block text-[10px] font-mono text-neutral-400 uppercase">Filme Comum (0)</span>
          <span className="text-xs text-neutral-300 font-medium">Nota IMDb &lt; 8.0</span>
        </div>
      </div>
    </div>
  );
};
