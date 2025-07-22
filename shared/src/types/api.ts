import { Word } from './index.js';

// DTOs para la API
export interface GetRandomWordResponse {
  word: string;
  accentType: string;
  explanation: string;
  syllables?: string[];
}

export interface GetBatchWordsRequest {
  count: number;
}

export interface GetBatchWordsResponse {
  words: GetRandomWordResponse[];
}

// Tipos de error de API
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}