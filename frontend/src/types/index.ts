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

// Configuraciones de la aplicación
export const APP_CONFIG = {
  API_BASE_URL: (typeof window !== 'undefined' && (window as any).VITE_API_BASE_URL) || 'http://localhost:3001',
  CACHE_EXPIRY_HOURS: 24,
  MIN_CACHE_WORDS: 20,
  MAX_BATCH_SIZE: 50,
  DEFAULT_BATCH_SIZE: 10,
} as const;

// Mensajes de la aplicación
export const MESSAGES = {
  LOADING: 'Cargando palabra...',
  ERROR_NETWORK: 'Error de conexión. Usando palabras guardadas.',
  ERROR_NO_CACHE: 'No hay palabras disponibles. Verifica tu conexión.',
  CORRECT_ANSWER: '¡Correcto!',
  INCORRECT_ANSWER: 'Incorrecto',
  STREAK_MESSAGE: '¡Racha de {count} respuestas correctas!',
} as const;

// Tipos de acento con sus descripciones
export const ACCENT_TYPES = {
  aguda: {
    label: 'Aguda',
    description: 'Acento en la última sílaba',
    examples: ['canción', 'café', 'reloj'],
  },
  grave: {
    label: 'Grave/Llana',
    description: 'Acento en la penúltima sílaba',
    examples: ['casa', 'árbol', 'fácil'],
  },
  esdrujula: {
    label: 'Esdrújula',
    description: 'Acento en la antepenúltima sílaba',
    examples: ['teléfono', 'médico', 'rápido'],
  },
} as const;