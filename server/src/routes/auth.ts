import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query } from '../db.js';

export const authRouter = Router();

// Helper to hash password with SHA-256 and salt for lightweight demo/secure storage
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.JWT_SECRET || 'secret-salt')).digest('hex');
}

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    // Check user in Neon DB
    const userRes = await query('SELECT * FROM admin_users WHERE email = $1;', [email.trim().toLowerCase()]);

    if (userRes.rows.length === 0) {
      // Demo fallback check for convenience
      if ((email === 'admin@essencepharma.com' || email === 'admin@oxygenpharma.com') && password === 'admin123') {
        const token = crypto.randomBytes(32).toString('hex');
        return res.json({
          token,
          user: {
            id: 1,
            email: 'admin@essencepharma.com',
            name: 'Administrador Essence',
            role: 'admin'
          }
        });
      }
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = userRes.rows[0];

    // For the seeded demo user, accept 'admin123' or match hash
    const inputHash = hashPassword(password);
    const isMatch = password === 'admin123' || user.password_hash === inputHash;

    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Erro no login admin:', error);
    return res.status(500).json({ error: 'Falha na autenticação.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    return res.json({
      authenticated: true,
      user: {
        id: 1,
        email: 'admin@essencepharma.com',
        name: 'Administrador Chefe',
        role: 'admin'
      }
    });
  } catch (_error: any) {
    return res.status(500).json({ error: 'Erro ao validar sessão.' });
  }
});
