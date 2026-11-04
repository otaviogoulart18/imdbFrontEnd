export interface MovieFormData {
  year: number;
  runtime: number;
  metascore: number;
  votes: number;
  title?: string;
}

export interface ApiPayload {
  year: string;
  runtime: string;
  metascore: string;
  votes: string;
}

export interface ApiResponse {
  status: 'success' | 'error';
  prediction: 0 | 1;
  label: string;
  probability: string;
  message?: string;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  title: string;
  input: MovieFormData;
  payload: ApiPayload;
  response: ApiResponse;
  isSimulated?: boolean;
}
