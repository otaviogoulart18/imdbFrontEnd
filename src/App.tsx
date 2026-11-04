import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Presets } from './components/Presets';
import { PredictionForm } from './components/PredictionForm';
import { ResultDisplay } from './components/ResultDisplay';
import { PayloadInspector } from './components/PayloadInspector';
import { HistoryList } from './components/HistoryList';
import { SvmExplainer } from './components/SvmExplainer';
import {
  MovieFormData,
  ApiResponse,
  ApiPayload,
  PredictionHistoryItem,
} from './types/prediction';
import { MoviePreset, MOVIE_PRESETS } from './data/presets';
import {
  sendPrediction,
  simulateLocalSvmPrediction,
  formatPayload,
} from './services/api';
import { Film, Award, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

const DEFAULT_FORM_DATA: MovieFormData = {
  title: 'Um Sonho de Liberdade',
  year: 1994,
  runtime: 142,
  metascore: 80,
  votes: 2343110,
};

const STORAGE_KEY = 'imdb_svm_history_v1';

export default function App() {
  const [formData, setFormData] = useState<MovieFormData>(DEFAULT_FORM_DATA);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('shawshank');
  const [apiMode, setApiMode] = useState<'render' | 'simulation'>('render');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [lastPayload, setLastPayload] = useState<ApiPayload | null>(null);
  const [isSimulatedResult, setIsSimulatedResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<PredictionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<any>(null);

  // Efeito para contador de segundos durante o loading
  useEffect(() => {
    if (isLoading) {
      setLoadingSeconds(0);
      timerRef.current = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoadingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  // Salvar histórico no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignorar quota exceeded
    }
  }, [history]);

  const handleFieldChange = (field: keyof MovieFormData, value: number) => {
    setSelectedPresetId(''); // Desmarca preset se o usuário customizar valores
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      title: prev.title === 'Um Sonho de Liberdade' && field !== 'year' ? 'Filme Customizado' : prev.title,
    }));
  };

  const handleSelectPreset = (preset: MoviePreset) => {
    setSelectedPresetId(preset.id);
    setFormData({
      ...preset.data,
      title: preset.name,
    });
  };

  const handleReset = () => {
    setSelectedPresetId('shawshank');
    setFormData(DEFAULT_FORM_DATA);
    setError(null);
  };

  const executePrediction = async (mode: 'render' | 'simulation') => {
    setIsLoading(true);
    setError(null);

    const payload = formatPayload(formData);
    setLastPayload(payload);

    try {
      if (mode === 'simulation') {
        // Simulação instantânea com delay visual sutil para feedback
        await new Promise((r) => setTimeout(r, 600));
        const simResult = simulateLocalSvmPrediction(formData);
        setResult(simResult.response);
        setIsSimulatedResult(true);

        // Adiciona ao histórico
        const historyItem: PredictionHistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
          title: formData.title || 'Filme Personalizado',
          input: { ...formData },
          payload: simResult.payload,
          response: simResult.response,
          isSimulated: true,
        };
        setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
      } else {
        // Envio real para o backend no Render
        const res = await sendPrediction(formData);
        setResult(res.response);
        setIsSimulatedResult(false);

        const historyItem: PredictionHistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
          title: formData.title || 'Filme Personalizado',
          input: { ...formData },
          payload: res.payload,
          response: res.response,
          isSimulated: false,
        };
        setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao processar predição.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePrediction(apiMode);
  };

  const handleSelectHistory = (item: PredictionHistoryItem) => {
    setFormData(item.input);
    setResult(item.response);
    setLastPayload(item.payload);
    setIsSimulatedResult(!!item.isSimulated);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-[#f3f4f6] flex flex-col font-sans">
      <Navbar
        onReset={handleReset}
        apiMode={apiMode}
        onToggleApiMode={setApiMode}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section Cinematográfica */}
        <section className="relative rounded-2xl overflow-hidden border border-[#27272a] bg-gradient-to-r from-[#18181b] via-[#121214] to-[#18181b] p-6 sm:p-8 shadow-2xl">
          {/* Luz dourada de fundo */}
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-[#F5C518]/10 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201d12] border border-[#F5C518]/40 text-[#F5C518] text-xs font-mono font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Machine Learning com Support Vector Machine (SVM)
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Classificador Preditivo de Filmes <span className="text-[#F5C518]">IMDb</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Avalie se um longa-metragem possui os atributos vetoriais característicos do grupo seleto <strong>Top Filme (IMDb ≥ 8.0)</strong> através do modelo SVM calibrado com milhares de produções da história do cinema.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 pt-5 border-t border-[#27272a] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="block text-neutral-500 text-[11px]">Algoritmo</span>
                <span className="font-bold text-white">SVM (RBF Kernel)</span>
              </div>
              <div>
                <span className="block text-neutral-500 text-[11px]">Corte Decisório</span>
                <span className="font-bold text-[#F5C518]">Nota IMDb ≥ 8.0</span>
              </div>
              <div>
                <span className="block text-neutral-500 text-[11px]">Features</span>
                <span className="font-bold text-white">Ano, Duração, Meta, Votos</span>
              </div>
              <div>
                <span className="block text-neutral-500 text-[11px]">Servidor Backend</span>
                <span className="font-bold text-emerald-400">Render Cloud</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks / Exemplos de Filmes */}
        <Presets
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        {/* Grade Principal: Formulário e Painel de Resposta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <PredictionForm
              formData={formData}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isLoading={isLoading}
              apiMode={apiMode}
              loadingSeconds={loadingSeconds}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <ResultDisplay
              result={result}
              payload={lastPayload}
              formData={formData}
              isLoading={isLoading}
              error={error}
              isSimulated={isSimulatedResult}
              onRetry={() => executePrediction('render')}
              onTryLocalSimulation={() => {
                setApiMode('simulation');
                executePrediction('simulation');
              }}
            />

            {/* Inspecionador de Requisição e Resposta JSON */}
            <PayloadInspector payload={lastPayload} response={result} />
          </div>
        </div>

        {/* Seção Explicativa do Modelo SVM */}
        <SvmExplainer />

        {/* Histórico de Predições */}
        <HistoryList
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          onDeleteItem={handleDeleteHistoryItem}
        />
      </main>

      {/* Footer Profissional e Limpo */}
      <footer className="border-t border-[#27272a] bg-[#0c0c0e] py-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-5 rounded bg-[#F5C518] px-1.5 text-[10px] font-black text-black flex items-center">
              IMDb
            </span>
            <span className="text-neutral-300 font-medium">
              ML Predictor Dashboard
            </span>
            <span className="text-neutral-600">·</span>
            <span>Support Vector Machine</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-500">
            <span>React 19 + Vite 8.3</span>
            <span>·</span>
            <span>Tailwind CSS</span>
            <span>·</span>
            <span>esbuild ^0.28.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
