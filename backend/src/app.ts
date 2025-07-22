import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { wordsRouter } from './routes/words.routes.js';
import { adminRouter } from './routes/admin.routes.js';

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://localhost:5173',
    'https://clasificador-acentos.netlify.app',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
}));

// Parsing de JSON
app.use(express.json());

// Logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/words', wordsRouter);
app.use('/api/admin', adminRouter);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'clasificador-acentos-api',
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Ruta no encontrada',
      code: 'NOT_FOUND',
    },
  });
});

// Manejo global de errores
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no manejado:', error);
  
  res.status(500).json({
    success: false,
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    },
  });
});

export { app };