import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  GameState, 
  GameStats, 
  Word,
  AccentType, 
  AnswerResult,
  GamePhase
} from '../types/index.js';
import { wordsApi } from '../api/words.api.js';

interface GameStore extends GameState {
  // Additional state for word control
  recentWords: string[];
  
  // Actions
  loadNewWord: () => Promise<void>;
  submitAnswer: (answer: AccentType) => Promise<AnswerResult>;
  resetStats: () => void;
  nextQuestion: () => void;
  
  // Computed
  getAccuracyPercentage: () => number;
}

const initialStats: GameStats = {
  correct: 0,
  incorrect: 0,
  streak: 0,
  totalAnswered: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // State
      currentWord: null,
      stats: initialStats,
      isLoading: false,
      gamePhase: 'waiting' as GamePhase,
      lastAnswer: undefined,
      recentWords: [],
      
      // Actions
      loadNewWord: async () => {
        set({ isLoading: true, gamePhase: 'waiting' });
        
        try {
          const { recentWords } = get();
          const MAX_RECENT_WORDS = 8; // Evitar repetir las últimas 8 palabras
          const MAX_ATTEMPTS = 10; // Máximo intentos para encontrar palabra nueva
          
          let attempts = 0;
          let wordData;
          let newWord: Word;
          
          // Intentar obtener una palabra que no esté en las recientes
          do {
            wordData = await wordsApi.getRandomWord();
            newWord = {
              word: wordData.word,
              accentType: wordData.accentType as AccentType,
              explanation: wordData.explanation,
              syllables: wordData.syllables,
            };
            attempts++;
          } while (
            recentWords.includes(newWord.word) && 
            attempts < MAX_ATTEMPTS
          );
          
          // Actualizar lista de palabras recientes
          const updatedRecentWords = [newWord.word, ...recentWords]
            .slice(0, MAX_RECENT_WORDS);
          
          set({ 
            currentWord: newWord, 
            isLoading: false, 
            gamePhase: 'answering',
            lastAnswer: undefined,
            recentWords: updatedRecentWords
          });
          
        } catch (error) {
          console.error('Error cargando palabra:', error);
          set({ 
            isLoading: false, 
            gamePhase: 'waiting',
            currentWord: null 
          });
          throw error;
        }
      },
      
      submitAnswer: async (answer: AccentType): Promise<AnswerResult> => {
        const { currentWord, stats } = get();
        
        if (!currentWord) {
          throw new Error('No hay palabra actual');
        }
        
        const isCorrect = currentWord.accentType === answer;
        
        // Actualizar estadísticas
        const newStats: GameStats = {
          correct: stats.correct + (isCorrect ? 1 : 0),
          incorrect: stats.incorrect + (isCorrect ? 0 : 1),
          streak: isCorrect ? stats.streak + 1 : 0,
          totalAnswered: stats.totalAnswered + 1,
        };
        
        const result: AnswerResult = {
          isCorrect,
          correctAnswer: currentWord.accentType,
          explanation: currentWord.explanation,
        };
        
        set({
          stats: newStats,
          gamePhase: 'feedback',
          lastAnswer: {
            selected: answer,
            isCorrect,
          },
        });
        
        return result;
      },
      
      resetStats: () => {
        set({ 
          stats: initialStats,
          lastAnswer: undefined,
          recentWords: [] // Limpiar también las palabras recientes
        });
      },
      
      nextQuestion: () => {
        set({ gamePhase: 'waiting' });
        get().loadNewWord();
      },
      
      // Computed
      getAccuracyPercentage: () => {
        const { stats } = get();
        if (stats.totalAnswered === 0) return 0;
        return Math.round((stats.correct / stats.totalAnswered) * 100);
      },
    }),
    {
      name: 'game-stats',
      partialize: (state) => ({ 
        stats: state.stats, 
        recentWords: state.recentWords 
      }),
    }
  )
);