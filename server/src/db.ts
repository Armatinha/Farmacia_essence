import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.warn('⚠️ AVISO: Nenhuma string de conexão Neon/PostgreSQL encontrada (DATABASE_URL, POSTGRES_URL).');
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do Neon PostgreSQL:', err);
});

export async function query<T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Neon DB] Executado em ${duration}ms: ${text.slice(0, 80).replace(/\s+/g, ' ')}...`);
    }
    return res;
  } catch (error) {
    console.error(`[Neon DB] Erro na query: ${text}`, error);
    throw error;
  }
}

export async function checkNeonConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT NOW() as now, version() as version;');
    console.log(`✅ Conectado com sucesso ao Neon PostgreSQL! Versão: ${res.rows[0]?.version?.split(' ')[0]} ${res.rows[0]?.version?.split(' ')[1]}`);
    return true;
  } catch (error) {
    console.error('❌ Falha ao conectar ao Neon PostgreSQL:', error);
    return false;
  }
}
