// Tipos básicos del dominio
export type AccentType = 'aguda' | 'grave' | 'esdrujula';

// Interfaz principal para una palabra
export interface Word {
  word: string;
  accentType: AccentType;
  explanation: string;
  syllables?: string[];
}

// Estadísticas del juego
export interface GameStats {
  correct: number;
  incorrect: number;
  streak: number;
  totalAnswered: number;
}

// Estado del juego
export type GamePhase = 'waiting' | 'answering' | 'feedback';

export interface GameState {
  currentWord: Word | null;
  stats: GameStats;
  isLoading: boolean;
  gamePhase: GamePhase;
  lastAnswer?: {
    selected: AccentType;
    isCorrect: boolean;
  };
}

// Resultado de una respuesta
export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: AccentType;
  explanation: string;
}

// Estado del cache
export interface CacheStatus {
  wordsCount: number;
  lastUpdated: Date | null;
  isOnline: boolean;
}

// Clasificación de acento con detalles
export interface AccentClassification {
  type: AccentType;
  stressedSyllableIndex: number;
  syllables: string[];
  explanation: string;
}