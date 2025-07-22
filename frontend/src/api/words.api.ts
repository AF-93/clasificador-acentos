import { GetRandomWordResponse, GetBatchWordsResponse } from '../types/index.js';
import { apiClient } from './client.js';
import { getRandomWord, getBatchWords } from '../data/words.js';

export interface IApiClient {
  getRandomWord(): Promise<GetRandomWordResponse>;
  getBatchWords(count: number): Promise<GetBatchWordsResponse>;
}

export class WordsApi implements IApiClient {
  
  async getRandomWord(): Promise<GetRandomWordResponse> {
    try {
      // Intentar obtener palabra de la API remota
      return await apiClient.get<GetRandomWordResponse>('/words/random');
    } catch (error) {
      console.warn('API remota no disponible, usando palabras locales:', error);
      
      // Fallback a palabras locales
      const localWord = getRandomWord();
      return {
        word: localWord.word,
        accentType: localWord.accentType,
        explanation: localWord.explanation,
        syllables: localWord.syllables,
      };
    }
  }
  
  async getBatchWords(count: number = 10): Promise<GetBatchWordsResponse> {
    try {
      // Intentar obtener palabras de la API remota
      return await apiClient.get<GetBatchWordsResponse>('/words/batch', { count });
    } catch (error) {
      console.warn('API remota no disponible para lote, usando palabras locales:', error);
      
      // Fallback a palabras locales
      const localWords = getBatchWords(count);
      return {
        words: localWords.map(word => ({
          word: word.word,
          accentType: word.accentType,
          explanation: word.explanation,
          syllables: word.syllables,
        }))
      };
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