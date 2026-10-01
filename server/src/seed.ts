import { pool } from './db.js';

async function seed() {
  console.log('🌱 Iniciando seed do banco Neon PostgreSQL...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Products
    console.log('📦 Inserindo produtos...');
    await client.query(`
      INSERT INTO products (name, slug, concentration, formula, category, purity, description, presentations, image_url)
      VALUES 
      ('GHK-Cu', 'ghk-cu', '100 mg', 'C₁₄H₂₄CuN₆O₄', 'Peptídeos', '≥ 98.9% HPLC', 'Complexo de peptídeo de cobre associado ao suporte de pele, cabelo e tecidos.', '3 apresentações: Liofilizado · Solução · Caneta injetável', 'https://veltrix.cidadeinter.com.br/assets/veltrix-box-detail-BeErPC1r.jpg'),
      ('GLOW', 'glow', '70 mg', 'OXY-G7', 'Peptídeos', '≥ 99.0% HPLC', 'Blend focado na radiância da pele, suporte à hidratação e bem-estar cosmético.', '2 apresentações: Liofilizado · Caneta injetável', 'https://veltrix.cidadeinter.com.br/assets/veltrix-pens-XEO0bia-.jpg'),
      ('RETAGEN', 'retagen', '40 mg', 'OXY-R4', 'Hormonal', '≥ 99.4% HPLC', 'Retatrutida - formulação de triplo agonista avançada.', '2 apresentações: Liofilizado · Caneta injetável', 'https://veltrix.cidadeinter.com.br/assets/veltrix-box-detail-BeErPC1r.jpg'),
      ('TIRZEGEN', 'tirzegen', '60 mg', 'OXY-T6', 'Hormonal', '≥ 99.2% HPLC', 'Tirzepatida - formulação de duplo agonista otimizada.', '2 apresentações: Liofilizado · Caneta injetável', 'https://veltrix.cidadeinter.com.br/assets/veltrix-pens-XEO0bia-.jpg')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // 2. Batches
    console.log('🏷️ Inserindo lotes...');
    await client.query(`
      INSERT INTO batches (batch_number, product_id, manufacturing_date, expiry_date, total_codes, active, notes)
      VALUES 
      ('LOT-GHK-2026A', (SELECT id FROM products WHERE slug = 'ghk-cu'), '2026-01-10', '2028-01-10', 5000, true, 'Lote padrão para exportação'),
      ('LOT-GLW-2026B', (SELECT id FROM products WHERE slug = 'glow'), '2026-02-15', '2028-02-15', 3500, true, 'Lote premium liofilizado'),
      ('LOT-RET-2026C', (SELECT id FROM products WHERE slug = 'retagen'), '2026-03-01', '2028-03-01', 3000, true, 'Lote clínico triplo agonista'),
      ('LOT-TRZ-2026D', (SELECT id FROM products WHERE slug = 'tirzegen'), '2026-03-10', '2028-03-10', 3500, true, 'Lote canetas de alta precisão')
      ON CONFLICT (batch_number) DO NOTHING;
    `);

    // 3. Product Codes
    console.log('🔑 Inserindo códigos de segurança...');
    await client.query(`
      INSERT INTO product_codes (code, batch_id, product_id, times_checked, first_checked_at, last_checked_at, status)
      VALUES
      ('VALIDO1', (SELECT id FROM batches WHERE batch_number = 'LOT-GHK-2026A'), (SELECT id FROM products WHERE slug = 'ghk-cu'), 0, NULL, NULL, 'ACTIVE'),
      ('USADO2', (SELECT id FROM batches WHERE batch_number = 'LOT-GLW-2026B'), (SELECT id FROM products WHERE slug = 'glow'), 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour', 'ACTIVE'),
      ('XY9-8L4-ZQX', (SELECT id FROM batches WHERE batch_number = 'LOT-RET-2026C'), (SELECT id FROM products WHERE slug = 'retagen'), 1, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', 'ACTIVE'),
      ('A72-9B1-XXX', (SELECT id FROM batches WHERE batch_number = 'LOT-TRZ-2026D'), (SELECT id FROM products WHERE slug = 'tirzegen'), 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours', 'ACTIVE'),
      ('OXY-PREMIUM-01', (SELECT id FROM batches WHERE batch_number = 'LOT-GHK-2026A'), (SELECT id FROM products WHERE slug = 'ghk-cu'), 0, NULL, NULL, 'ACTIVE'),
      ('OXY-PREMIUM-02', (SELECT id FROM batches WHERE batch_number = 'LOT-GLW-2026B'), (SELECT id FROM products WHERE slug = 'glow'), 0, NULL, NULL, 'ACTIVE'),
      ('REVOKED-99', (SELECT id FROM batches WHERE batch_number = 'LOT-GHK-2026A'), (SELECT id FROM products WHERE slug = 'ghk-cu'), 0, NULL, NULL, 'REVOKED')
      ON CONFLICT (code) DO NOTHING;
    `);

    // 4. Verification Logs
    console.log('📊 Inserindo logs de telemetria...');
    await client.query(`
      INSERT INTO verification_logs (code_queried, code_id, status_result, ip_address, user_agent, location, times_checked_at_moment, created_at)
      VALUES
      ('XY9-8L4-ZQX', (SELECT id FROM product_codes WHERE code = 'XY9-8L4-ZQX'), 'VALID_FIRST_TIME', '189.120.45.10', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'BR / São Paulo', 1, NOW() - INTERVAL '3 hours'),
      ('A72-9B1-XXX', (SELECT id FROM product_codes WHERE code = 'A72-9B1-XXX'), 'WARNING_MULTIPLE_USE', '177.92.14.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'BR / Rio de Janeiro', 3, NOW() - INTERVAL '2 hours'),
      ('INVALIDO-99', NULL, 'NOT_FOUND', '201.88.192.5', 'Mozilla/5.0 (Android 14; Mobile)', 'BR / Belo Horizonte', 0, NOW() - INTERVAL '1 day'),
      ('USADO2', (SELECT id FROM product_codes WHERE code = 'USADO2'), 'WARNING_MULTIPLE_USE', '189.40.21.3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'BR / Curitiba', 2, NOW() - INTERVAL '1 hour'),
      ('FAKE-CODE-123', NULL, 'NOT_FOUND', '187.60.10.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'BR / Porto Alegre', 0, NOW() - INTERVAL '4 hours');
    `);

    // 5. Admin User
    console.log('👤 Inserindo usuário administrador...');
    await client.query(`
      INSERT INTO admin_users (email, password_hash, name, role)
      VALUES ('admin@essencepharma.com', '$2a$10$wO0pTfJ9cOQZJkH1Y/K3u.W9t7i3m9rBfE9h0o6z7k9x1w2y3z4a5', 'Administrador Chefe', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅ Seed finalizado com sucesso no Neon PostgreSQL!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante o seed:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();
