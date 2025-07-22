// Configuraciones de la aplicación
export const APP_CONFIG = {
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
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

// Configuración de cache
export const CACHE_CONFIG = {
  DB_NAME: 'ClasificadorAcentos',
  DB_VERSION: 1,
  STORE_NAME: 'words',
} as const;