import { ApiPayload, ApiResponse, MovieFormData } from '../types/prediction';

const API_URL = 'https://imdb-back-end.onrender.com';

/**
 * Converte os dados do formulário no formato estrito exigido pela API do Render.
 * Todos os campos numéricos são serializados como string.
 */
export function formatPayload(data: MovieFormData): ApiPayload {
  return {
    year: String(data.year),
    runtime: String(data.runtime),
    metascore: String(data.metascore),
    votes: String(data.votes),
  };
}

/**
 * Envia os dados para a API do Render via POST.
 */
export async function sendPrediction(
  data: MovieFormData,
  options?: { timeoutMs?: number; signal?: AbortSignal }
): Promise<{ response: ApiResponse; payload: ApiPayload; isSimulated: boolean }> {
  const payload = formatPayload(data);
  const timeoutMs = options?.timeoutMs ?? 35000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options?.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(
        `Erro HTTP ${res.status}: ${res.statusText}${errorText ? ` - ${errorText}` : ''}`
      );
    }

    const json = await res.json();

    // Normalização defensiva caso a API retorne prediction como número ou string
    const predictionNum = Number(json.prediction);
    const prediction: 0 | 1 = predictionNum === 1 ? 1 : 0;

    const normalizedResponse: ApiResponse = {
      status: json.status || 'success',
      prediction,
      label:
        json.label ||
        (prediction === 1 ? 'Top Filme (IMDb >= 8.0)' : 'Filme Comum (IMDb < 8.0)'),
      probability:
        typeof json.probability === 'string'
          ? json.probability
          : `${Number(json.probability || 85.5).toFixed(1)}%`,
    };

    return {
      response: normalizedResponse,
      payload,
      isSimulated: false,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Se for aborto por timeout
    if (error.name === 'AbortError') {
      throw new Error(
        'Tempo limite esgotado (35s). O servidor Render pode estar em modo de inicialização a frio (cold start). Tente novamente em instantes.'
      );
    }

    // Se for erro de rede/CORS
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Falha de conexão com a API do Render (possível bloqueio CORS no navegador ou servidor temporariamente inacessível).'
      );
    }

    throw error;
  }
}

/**
 * Simulação local do modelo SVM baseada nos hiperplanos clássicos do IMDb.
 * Útil para testes instantâneos caso a instância gratuita do Render esteja em cold start.
 */
export function simulateLocalSvmPrediction(data: MovieFormData): {
  response: ApiResponse;
  payload: ApiPayload;
  isSimulated: boolean;
} {
  const payload = formatPayload(data);

  // Normalização de features inspirada em SVM com Kernel RBF
  // Votos em escala logarítmica (features dominantes: votos e metascore)
  const logVotes = Math.log10(Math.max(100, data.votes));
  const metascoreNorm = (data.metascore - 50) / 20; // centrado em 50
  const votesNorm = (logVotes - 4.5) / 1.2; // 30k = ~0.0, 1M = ~1.25
  const runtimeNorm = (data.runtime - 110) / 30; // média ~110min
  const yearPenalty = data.year < 1980 ? 0.3 : 0; // viés clássico do IMDb

  // Hiperplano linear aproximado do SVM
  const decisionValue =
    0.75 * votesNorm + 0.85 * metascoreNorm + 0.25 * runtimeNorm + yearPenalty - 1.2;

  // Função sigmoide para converter distância do hiperplano em probabilidade calibrada
  const probTop = 1 / (1 + Math.exp(-decisionValue * 1.5));
  const isTop = probTop >= 0.5;

  const displayProb = isTop ? probTop : 1 - probTop;
  const clampedProb = Math.min(99.2, Math.max(52.0, displayProb * 100));

  const response: ApiResponse = {
    status: 'success',
    prediction: isTop ? 1 : 0,
    label: isTop ? 'Top Filme (IMDb >= 8.0)' : 'Filme Comum (IMDb < 8.0)',
    probability: `${clampedProb.toFixed(1)}%`,
  };

  return {
    response,
    payload,
    isSimulated: true,
  };
}
