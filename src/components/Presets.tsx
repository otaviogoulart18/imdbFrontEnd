import React from 'react';
import { MOVIE_PRESETS, MoviePreset } from '../data/presets';
import { Film, Award, Clapperboard, Star } from 'lucide-react';

interface PresetsProps {
  onSelectPreset: (preset: MoviePreset) => void;
  selectedPresetId?: string;
}

export const Presets: React.FC<PresetsProps> = ({
  onSelectPreset,
  selectedPresetId,
}) => {
  return (
    <section id="presets" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-[#F5C518]" />
            Benchmarks & Exemplos Prontos
          </h2>
          <p className="text-xs text-neutral-400">
            Clique em qualquer título para preencher o formulário automaticamente com métricas reais do IMDb
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {MOVIE_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isTop = preset.expectedClass === 'top';

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#201d12] border-[#F5C518] shadow-lg shadow-[#F5C518]/10 ring-1 ring-[#F5C518]'
                  : 'bg-[#18181b] border-[#27272a] hover:border-neutral-500 hover:bg-[#1f1f23]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-semibold tracking-wider uppercase font-mono ${
                      isTop ? 'text-[#F5C518]' : 'text-neutral-400'
                    }`}
                  >
                    {isTop ? '★ Top 250' : 'Comum'}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {preset.data.year}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#F5C518] transition-colors">
                  {preset.name}
                </h3>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#27272a]/60 text-[11px] font-mono text-neutral-400 space-y-0.5 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Duração:</span>
                  <span>{preset.data.runtime}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Meta:</span>
                  <span
                    className={
                      preset.data.metascore >= 75
                        ? 'text-emerald-400 font-semibold'
                        : preset.data.metascore >= 60
                        ? 'text-yellow-400'
                        : 'text-neutral-300'
                    }
                  >
                    {preset.data.metascore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Votos:</span>
                  <span className="truncate max-w-[65px] text-right">
                    {(preset.data.votes / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
