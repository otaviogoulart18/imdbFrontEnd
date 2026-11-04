import React from 'react';
import { PredictionHistoryItem, MovieFormData } from '../types/prediction';
import {
  History,
  Trash2,
  Trophy,
  Film,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';

interface HistoryListProps {
  history: PredictionHistoryItem[];
  onSelectHistory: (item: PredictionHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteItem,
}) => {
  if (history.length === 0) return null;

  return (
    <section id="historico" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#F5C518]" />
          Histórico Recente de Predições ({history.length})
        </h2>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar Histórico</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121214] text-neutral-400 border-b border-[#27272a] font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Produção / Filme</th>
                <th className="py-3 px-4 font-semibold">Ano</th>
                <th className="py-3 px-4 font-semibold">Duração</th>
                <th className="py-3 px-4 font-semibold">Metascore</th>
                <th className="py-3 px-4 font-semibold">Votos IMDb</th>
                <th className="py-3 px-4 font-semibold">Classificação SVM</th>
                <th className="py-3 px-4 font-semibold">Probabilidade</th>
                <th className="py-3 px-4 text-right font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] font-mono text-neutral-300 tabular-nums">
              {history.map((item) => {
                const isTop = item.response.prediction === 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#1f1f23] transition-colors group"
                  >
                    <td className="py-3 px-4 font-sans font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {isTop ? (
                          <Trophy className="w-3.5 h-3.5 text-[#F5C518] shrink-0" />
                        ) : (
                          <Film className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        )}
                        <span className="truncate max-w-[180px]">
                          {item.title || 'Filme Personalizado'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.input.year}</td>
                    <td className="py-3 px-4">{item.input.runtime}m</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          item.input.metascore >= 70
                            ? 'text-emerald-400'
                            : item.input.metascore >= 50
                            ? 'text-yellow-400'
                            : 'text-neutral-400'
                        }`}
                      >
                        {item.input.metascore}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.input.votes.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {isTop ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F5C518]">
                          ★ Top Filme
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                          Filme Comum
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {item.response.probability}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectHistory(item)}
                          className="text-[#F5C518] hover:underline flex items-center gap-0.5 font-sans text-[11px]"
                          title="Carregar de volta no formulário"
                        >
                          Carregar
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                          title="Excluir do histórico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
