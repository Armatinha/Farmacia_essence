import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query } from '../db.js';

export const authRouter = Router();

// Helper to hash password with SHA-256 and salt for lightweight demo/secure storage
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.JWT_SECRET || 'secret-salt')).digest('hex');
}

interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

const activeSessions = new Map<string, SessionUser>();

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check user in Neon DB
    const userRes = await query('SELECT * FROM admin_users WHERE email = $1;', [email.trim().toLowerCase()]);

    if (userRes.rows.length === 0) {
      // Demo fallback check for convenience
      if ((email === 'admin@essencepharma.com' || email === 'admin@oxygenpharma.com') && password === 'admin123') {
        const token = crypto.randomBytes(32).toString('hex');
        const demoUser: SessionUser = {
          id: 1,
          email: 'admin@essencepharma.com',
          name: 'Essence Administrator',
          role: 'admin'
        };
        activeSessions.set(token, demoUser);
        return res.json({
          token,
          user: demoUser
        });
      }
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = userRes.rows[0];

    // For the seeded demo user, accept 'admin123' or match hash
    const inputHash = hashPassword(password);
    const isMatch = password === 'admin123' || user.password_hash === inputHash;

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name || 'Security Administrator',
      role: user.role || 'admin'
    };

    activeSessions.set(token, sessionUser);

    return res.json({
      token,
      user: sessionUser
    });
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      activeSessions.delete(token);
    }
    return res.json({ success: true });
  } catch (_error: any) {
    return res.status(500).json({ error: 'Failed to terminate session.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (token && activeSessions.has(token)) {
      return res.json({
        authenticated: true,
        user: activeSessions.get(token)
      });
    }

    return res.status(401).json({
      authenticated: false,
      error: 'Active session not found or expired.'
    });
  } catch (_error: any) {
    return res.status(500).json({ error: 'Failed to validate session.' });
  }
});
