import { Word } from '../types/index.js';
import { IWordsRepository, WordsRepository } from '../database/repositories/index.js';
import { AccentClassifier } from '../classification/index.js';
import axios from 'axios';

export interface IWordsService {
  getRandomWord(): Promise<Word>;
  getBatchWords(count: number): Promise<Word[]>;
}

export class WordsService implements IWordsService {
  private wordsRepository: IWordsRepository;
  private classifier: AccentClassifier;
  
  constructor(
    wordsRepository?: IWordsRepository,
    classifier?: AccentClassifier
  ) {
    this.wordsRepository = wordsRepository || new WordsRepository();
    this.classifier = classifier || new AccentClassifier();
  }
  
  async getRandomWord(): Promise<Word> {
    try {
      // Intentar obtener una palabra de la base de datos
      const word = await this.wordsRepository.findRandom();
      
      if (!word) {
        throw new Error('No hay palabras disponibles en la base de datos');
      }
      
      return word;
      
    } catch (error) {
      console.error('Error en WordsService.getRandomWord:', error);
      throw error;
    }
  }
  
  async getBatchWords(count: number = 10): Promise<Word[]> {
    try {
      // Validar el límite
      const maxCount = 50;
      const validCount = Math.min(Math.max(count, 1), maxCount);
      
      // Obtener palabras de la base de datos
      const words = await this.wordsRepository.findMany(validCount);
      
      if (words.length === 0) {
        throw new Error('No hay palabras disponibles en la base de datos');
      }
      
      // Si necesitamos más palabras de las disponibles, repetir algunas aleatoriamente
      if (words.length < validCount) {
        const result = [...words];
        while (result.length < validCount) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          result.push(randomWord);
        }
        return result;
      }
      
      // Mezclar las palabras para que sean aleatorias
      return this.shuffleArray(words).slice(0, validCount);
      
    } catch (error) {
      console.error('Error en WordsService.getBatchWords:', error);
      throw error;
    }
  }
  
  // Método para obtener estadísticas de la base de datos
  async getStats() {
    try {
      const totalWords = await this.wordsRepository.count();
      const agudas = await this.wordsRepository.findByType('aguda');
      const graves = await this.wordsRepository.findByType('grave');
      const esdrujulas = await this.wordsRepository.findByType('esdrujula');
      
      return {
        total: totalWords,
        agudas: agudas.length,
        graves: graves.length,
        esdrujulas: esdrujulas.length,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
  
  // Método utilitario para mezclar arrays
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}