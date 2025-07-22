import { Word as PrismaWord } from '@prisma/client';
import { Word, AccentType } from '../../types/index.js';
import { prisma } from '../client.js';

export interface IWordsRepository {
  findRandom(): Promise<Word | null>;
  findByType(type: AccentType): Promise<Word[]>;
  create(word: CreateWordDto): Promise<Word>;
  findMany(limit: number): Promise<Word[]>;
  count(): Promise<number>;
}

export interface CreateWordDto {
  word: string;
  accentType: AccentType;
  explanation: string;
  syllables?: string[];
}

export class WordsRepository implements IWordsRepository {
  
  async findRandom(): Promise<Word | null> {
    try {
      // Obtener el total de palabras
      const count = await prisma.word.count();
      
      if (count === 0) {
        return null;
      }
      
      // Generar un índice aleatorio
      const randomIndex = Math.floor(Math.random() * count);
      
      // Obtener la palabra en esa posición
      const prismaWord = await prisma.word.findFirst({
        skip: randomIndex,
      });
      
      return prismaWord ? this.mapToWord(prismaWord) : null;
      
    } catch (error) {
      console.error('Error obteniendo palabra aleatoria:', error);
      throw new Error('Error al obtener palabra aleatoria');
    }
  }
  
  async findByType(type: AccentType): Promise<Word[]> {
    try {
      const prismaWords = await prisma.word.findMany({
        where: {
          accentType: type,
        },
      });
      
      return prismaWords.map(this.mapToWord);
      
    } catch (error) {
      console.error(`Error obteniendo palabras de tipo ${type}:`, error);
      throw new Error(`Error al obtener palabras de tipo ${type}`);
    }
  }
  
  async create(wordDto: CreateWordDto): Promise<Word> {
    try {
      const prismaWord = await prisma.word.create({
        data: {
          word: wordDto.word,
          accentType: wordDto.accentType,
          explanation: wordDto.explanation,
          syllables: wordDto.syllables ? JSON.stringify(wordDto.syllables) : null,
        },
      });
      
      return this.mapToWord(prismaWord);
      
    } catch (error) {
      console.error('Error creando palabra:', error);
      throw new Error('Error al crear palabra');
    }
  }
  
  async findMany(limit: number = 10): Promise<Word[]> {
    try {
      const prismaWords = await prisma.word.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return prismaWords.map(this.mapToWord);
      
    } catch (error) {
      console.error('Error obteniendo múltiples palabras:', error);
      throw new Error('Error al obtener palabras');
    }
  }
  
  async count(): Promise<number> {
    try {
      return await prisma.word.count();
    } catch (error) {
      console.error('Error contando palabras:', error);
      throw new Error('Error al contar palabras');
    }
  }
  
  // Método privado para mapear de Prisma Word a Word del dominio
  private mapToWord(prismaWord: PrismaWord): Word {
    return {
      word: prismaWord.word,
      accentType: prismaWord.accentType as AccentType,
      explanation: prismaWord.explanation,
      syllables: prismaWord.syllables ? JSON.parse(prismaWord.syllables) : undefined,
    };
  }
}