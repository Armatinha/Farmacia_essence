import dotenv from 'dotenv';
import crypto from 'crypto';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error('❌ Error: No DATABASE_URL found in environment.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

function hashPassword(password: string): string {
  const salt = process.env.JWT_SECRET || 'secret-salt';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

async function main() {
  const args = process.argv.slice(2);
  const email = args[0]?.trim().toLowerCase();
  const password = args[1]?.trim();
  const name = args[2]?.trim() || 'Essence Administrator';

  if (!email || !password) {
    console.log(`
Usage:
  npx tsx scripts/create-admin.ts <email> <password> [name]

Example:
  npx tsx scripts/create-admin.ts admin@essencepharma.com "SecurePass123" "Security Chief"
    `);
    process.exit(1);
  }

  const passwordHash = hashPassword(password);

  console.log(`🔐 Creating/Updating admin user: ${email}...`);

  try {
    const res = await pool.query(
      `INSERT INTO admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = EXCLUDED.password_hash,
           name = EXCLUDED.name,
           updated_at = NOW()
       RETURNING id, email, name, role;`,
      [email, passwordHash, name]
    );

    console.log('✅ Admin user successfully saved to Neon PostgreSQL!');
    console.table(res.rows);
  } catch (err: any) {
    console.error('❌ Failed to save admin user:', err.message);
  } finally {
    await pool.end();
  }
}

main();
