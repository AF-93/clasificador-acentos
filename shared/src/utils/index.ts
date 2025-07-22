import { AccentType } from '../types/index.js';

// Utilidades para manejo de strings
export const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim();
};

// Utilidades para estadísticas
export const calculatePercentage = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

// Utilidades para formateo
export const formatStreakMessage = (count: number): string => {
  return `¡Racha de ${count} respuestas correctas!`;
};

// Validaciones
export const isValidAccentType = (type: string): type is AccentType => {
  return ['aguda', 'grave', 'esdrujula'].includes(type);
};

// Utilidades para fechas
export const isExpired = (date: Date, hoursToExpire: number): boolean => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffInHours > hoursToExpire;
};

// Utilidades para arrays
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};