import React from 'react';
import { Cpu, Split, BarChart2, ShieldCheck, Binary } from 'lucide-react';

export const SvmExplainer: React.FC = () => {
  return (
    <section
      id="svm-info"
      className="rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27272a] text-[#F5C518]">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Arquitetura do Modelo SVM (Support Vector Machine)
            </h2>
            <p className="text-xs text-neutral-400">
              Classificação supervisionada via hiperplano de separação de margem máxima
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-[#121214] px-3 py-1.5 rounded-lg border border-[#27272a]">
          <span>Classe 1: IMDb ≥ 8.0</span>
          <span className="text-neutral-600">|</span>
          <span>Classe 0: IMDb &lt; 8.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#121214] border border-[#27272a] space-y-2">
          <div className="flex items-center gap-2 text-[#F5C518] text-xs font-bold uppercase tracking-wider font-mono">
            <Split className="w-4 h-4" />
            01. Hiperplano de Separação
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            O algoritmo encontra o hiperplano ótimo <code className="text-[#F5C518] font-mono">w · x + b = 0</code> no espaço quadridimensional de features que maximiza a distância entre filmes comuns e clássicos do IMDb.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#121214] border border-[#27272a] space-y-2">
          <div className="flex items-center gap-2 text-[#F5C518] text-xs font-bold uppercase tracking-wider font-mono">
            <BarChart2 className="w-4 h-4" />
            02. Ponderação de Variáveis
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            O <strong>Número de Votos</strong> (em escala logarítmica) e o <strong>Metascore</strong> da crítica especializada exercem os maiores pesos vetoriais para impulsionar a probabilidade para acima de 8.0.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#121214] border border-[#27272a] space-y-2">
          <div className="flex items-center gap-2 text-[#F5C518] text-xs font-bold uppercase tracking-wider font-mono">
            <Binary className="w-4 h-4" />
            03. Calibração de Probabilidade
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            A distância da amostra até o hiperplano é mapeada via função sigmoidal de Platt, gerando a porcentagem exata de confiança retornada no campo <code className="text-[#F5C518] font-mono">probability</code>.
          </p>
        </div>
      </div>
    </section>
  );
};
