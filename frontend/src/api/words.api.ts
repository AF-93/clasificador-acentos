import { GetRandomWordResponse, GetBatchWordsResponse } from '../types/index.js';
import { apiClient } from './client.js';

export interface IApiClient {
  getRandomWord(): Promise<GetRandomWordResponse>;
  getBatchWords(count: number): Promise<GetBatchWordsResponse>;
}

export class WordsApi implements IApiClient {
  
  async getRandomWord(): Promise<GetRandomWordResponse> {
    try {
      return await apiClient.get<GetRandomWordResponse>('/words/random');
    } catch (error) {
      console.error('Error obteniendo palabra aleatoria:', error);
      throw error;
    }
  }
  
  async getBatchWords(count: number = 10): Promise<GetBatchWordsResponse> {
    try {
      return await apiClient.get<GetBatchWordsResponse>('/words/batch', { count });
    } catch (error) {
      console.error('Error obteniendo lote de palabras:', error);
      throw error;
    }
  }
  
  async getStats() {
    try {
      return await apiClient.get('/words/stats');
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

export const wordsApi = new WordsApi();