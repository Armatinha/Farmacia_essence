import { Router, Request, Response } from 'express';
import { query } from '../db.js';

export const verifyRouter = Router();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function resolveLocationFromIp(ip: string): string {
  // Simple heuristic for demo/telemetry in dashboard
  if (ip === '127.0.0.1' || ip === '::1') return 'BR / São Paulo';
  if (ip.startsWith('189.')) return 'BR / São Paulo';
  if (ip.startsWith('177.')) return 'BR / Rio de Janeiro';
  if (ip.startsWith('201.')) return 'BR / Belo Horizonte';
  return 'BR / Brasil';
}

/**
 * POST /api/verify
 * Public endpoint to verify pharmaceutical authenticity code
 */
verifyRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        status: 'INVALID_REQUEST',
        message: 'Código de verificação não informado.'
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const clientIp = getClientIp(req);
    const userAgent = (req.headers['user-agent'] || '').slice(0, 500);
    const location = resolveLocationFromIp(clientIp);

    // Call atomic Neon PostgreSQL stored procedure
    const result = await query(
      'SELECT verify_product_code($1, $2, $3, $4) as result;',
      [cleanCode, clientIp, userAgent, location]
    );

    const verificationResult = result.rows[0]?.result;

    if (!verificationResult) {
      return res.status(500).json({
        success: false,
        status: 'INTERNAL_ERROR',
        message: 'Erro ao processar verificação de autenticidade.'
      });
    }

    // Set cache headers to prevent caching sensitive verification states
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return res.status(200).json(verificationResult);
  } catch (error: any) {
    console.error('❌ Erro na verificação de código:', error);
    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'Ocorreu uma falha temporária ao consultar o banco de segurança Neon.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
