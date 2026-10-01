import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkNeonConnection, pool } from './db.js';
import { verifyRouter } from './routes/verify.js';
import { productsRouter } from './routes/products.js';
import { batchesRouter } from './routes/batches.js';
import { telemetryRouter } from './routes/telemetry.js';
import { authRouter } from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as db_time, version() as version;');
    return res.json({
      status: 'online',
      service: 'Essence Pharma Backend API',
      database: 'Neon Serverless PostgreSQL 18',
      db_status: 'connected',
      db_time: dbRes.rows[0]?.db_time,
      uptime: process.uptime()
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'degraded',
      service: 'Essence Pharma Backend API',
      database: 'Neon Serverless PostgreSQL',
      db_status: 'disconnected',
      error: error.message
    });
  }
});

// Register API Routes
app.use('/api/verify', verifyRouter);
app.use('/api/products', productsRouter);
app.use('/api/batches', batchesRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/auth', authRouter);

// 404 Handler for undefined API routes
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: `Rota API ${req.originalUrl} não encontrada.` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Ocorreu um erro interno no servidor backend.',
    message: err.message
  });
});

// Start Server (only when not running inside Vercel Serverless Function)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`====================================================`);
    console.log(`🚀 Essence Pharma Backend rodando na porta ${PORT}`);
    console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Conectando ao Neon PostgreSQL...`);
    await checkNeonConnection();
    console.log(`====================================================`);
  });
}

export default app;
