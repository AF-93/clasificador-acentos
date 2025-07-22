import { Router, Request, Response } from 'express';
import { seed } from '../database/seed.js';

const router = Router();

// Endpoint temporal para ejecutar el seed
router.post('/seed', async (req: Request, res: Response) => {
  try {
    console.log('🌱 Iniciando seed desde endpoint...');
    await seed();
    
    res.json({
      success: true,
      message: 'Seed ejecutado correctamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Error ejecutando seed',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }
    });
  }
});

export { router as adminRouter };