import { Router, Request, Response } from 'express';
import { WordsService } from '../services/words.service.js';
import { GetRandomWordResponse, GetBatchWordsResponse, ApiResponse } from '../types/index.js';

const router = Router();
const wordsService = new WordsService();

// GET /api/words/random - Obtener una palabra aleatoria
router.get('/random', async (req: Request, res: Response) => {
  try {
    const word = await wordsService.getRandomWord();
    
    const response: ApiResponse<GetRandomWordResponse> = {
      success: true,
      data: {
        word: word.word,
        accentType: word.accentType,
        explanation: word.explanation,
        syllables: word.syllables,
      },
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error en /api/words/random:', error);
    
    const response: ApiResponse<GetRandomWordResponse> = {
      success: false,
      error: {
        message: 'Error al obtener palabra aleatoria',
        code: 'RANDOM_WORD_ERROR',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
    };
    
    res.status(500).json(response);
  }
});

// GET /api/words/batch - Obtener múltiples palabras
router.get('/batch', async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string) || 10;
    const words = await wordsService.getBatchWords(count);
    
    const response: ApiResponse<GetBatchWordsResponse> = {
      success: true,
      data: {
        words: words.map(word => ({
          word: word.word,
          accentType: word.accentType,
          explanation: word.explanation,
          syllables: word.syllables,
        })),
      },
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error en /api/words/batch:', error);
    
    const response: ApiResponse<GetBatchWordsResponse> = {
      success: false,
      error: {
        message: 'Error al obtener lote de palabras',
        code: 'BATCH_WORDS_ERROR',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
    };
    
    res.status(500).json(response);
  }
});

// GET /api/words/stats - Obtener estadísticas de palabras
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await wordsService.getStats();
    
    res.json({
      success: true,
      data: stats,
    });
    
  } catch (error) {
    console.error('Error en /api/words/stats:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener estadísticas',
        code: 'STATS_ERROR',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
    });
  }
});

export { router as wordsRouter };