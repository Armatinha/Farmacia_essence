import { pool } from './db.js';

async function seed() {
  console.log('🌱 Iniciando seed do banco Neon PostgreSQL...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Products
    console.log('📦 Inserindo produtos Essence Pharma...');
    await client.query(`
      INSERT INTO products (name, slug, concentration, formula, category, purity, description, presentations, image_url)
      VALUES 
      ('RETATRUTIDE', 'retatrutide', '40 mg', 'ESS-R40', 'Peptides', '≥ 99.4% HPLC', 'Retatrutide - Triple receptor agonist (GLP-1, GIP, Glucagon). Research-grade lyophilized powder.', 'Lyophilized powder · Dosing pen', '/src/assets/essence-vials.png'),
      ('TIRZEPATIDE', 'tirzepatide', '15 mg / 75 mg', 'ESS-T75', 'Metabolic', '≥ 99.2% HPLC', 'Tirzepatide - Dual GIP/GLP-1 receptor agonist. Available in precision dosing pen and lyophilized vial.', 'Precision pen 75mg · Lyophilized vial 15mg', '/src/assets/essence-pen-box.png'),
      ('SEMAGLUTIDE', 'semaglutide', '10 mg', 'ESS-S10', 'Peptides', '≥ 99.1% HPLC', 'Semaglutide - GLP-1 receptor agonist engineered for metabolic modulation and glycemic research.', 'Lyophilized · Sealed glass vial', '/src/assets/essence-vials.png'),
      ('BPC-157', 'bpc-157', '10 mg', 'ESS-B10', 'Regenerative', '≥ 99.0% HPLC', 'BPC-157 - Body Protection Compound peptide for cellular integrity and tissue repair protocols.', 'Lyophilized · Holographic security seal', '/src/assets/essence-seals.jpg'),
      ('IPAMORELIN', 'ipamorelin', '5 mg', 'ESS-I5', 'Secretagogues', '≥ 99.0% HPLC', 'Ipamorelin - Selective growth hormone secretagogue pentapeptide for advanced cellular research.', 'Lyophilized · Ultra-pure research grade', '/src/assets/essence-vials.png')
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        concentration = EXCLUDED.concentration,
        formula = EXCLUDED.formula,
        category = EXCLUDED.category,
        purity = EXCLUDED.purity,
        description = EXCLUDED.description,
        presentations = EXCLUDED.presentations,
        image_url = EXCLUDED.image_url;
    `);

    // 2. Batches
    console.log('🏷️ Inserindo lotes...');
    await client.query(`
      INSERT INTO batches (batch_number, product_id, manufacturing_date, expiry_date, total_codes, active, notes)
      VALUES 
      ('LOT-RET-2026A', (SELECT id FROM products WHERE slug = 'retatrutide'), '2026-03-01', '2028-03-01', 3000, true, 'Triple agonist clinical research batch'),
      ('LOT-TRZ-2026B', (SELECT id FROM products WHERE slug = 'tirzepatide'), '2026-03-10', '2028-03-10', 3500, true, 'Precision dosing pens batch'),
      ('LOT-SEM-2026C', (SELECT id FROM products WHERE slug = 'semaglutide'), '2026-02-15', '2028-02-15', 4000, true, 'Premium lyophilized peptide batch'),
      ('LOT-BPC-2026D', (SELECT id FROM products WHERE slug = 'bpc-157'), '2026-01-20', '2028-01-20', 5000, true, 'Holographic security batch'),
      ('LOT-IPA-2026E', (SELECT id FROM products WHERE slug = 'ipamorelin'), '2026-02-01', '2028-02-01', 2500, true, 'Ultra-pure research grade batch')
      ON CONFLICT (batch_number) DO NOTHING;
    `);

    // 3. Product Codes (6 Alphanumeric Characters e.g. 2H7MBT)
    console.log('🔑 Inserindo códigos de segurança de 6 dígitos...');
    await client.query(`
      INSERT INTO product_codes (code, batch_id, product_id, times_checked, first_checked_at, last_checked_at, status)
      VALUES
      ('2H7MBT', (SELECT id FROM batches WHERE batch_number = 'LOT-RET-2026A'), (SELECT id FROM products WHERE slug = 'retatrutide'), 0, NULL, NULL, 'ACTIVE'),
      ('VALI01', (SELECT id FROM batches WHERE batch_number = 'LOT-TRZ-2026B'), (SELECT id FROM products WHERE slug = 'tirzepatide'), 0, NULL, NULL, 'ACTIVE'),
      ('USED02', (SELECT id FROM batches WHERE batch_number = 'LOT-SEM-2026C'), (SELECT id FROM products WHERE slug = 'semaglutide'), 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour', 'ACTIVE'),
      ('RET40M', (SELECT id FROM batches WHERE batch_number = 'LOT-RET-2026A'), (SELECT id FROM products WHERE slug = 'retatrutide'), 1, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', 'ACTIVE'),
      ('TRZ75P', (SELECT id FROM batches WHERE batch_number = 'LOT-TRZ-2026B'), (SELECT id FROM products WHERE slug = 'tirzepatide'), 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours', 'ACTIVE'),
      ('BPC157', (SELECT id FROM batches WHERE batch_number = 'LOT-BPC-2026D'), (SELECT id FROM products WHERE slug = 'bpc-157'), 0, NULL, NULL, 'ACTIVE'),
      ('IPA05M', (SELECT id FROM batches WHERE batch_number = 'LOT-IPA-2026E'), (SELECT id FROM products WHERE slug = 'ipamorelin'), 0, NULL, NULL, 'ACTIVE'),
      ('REVK99', (SELECT id FROM batches WHERE batch_number = 'LOT-RET-2026A'), (SELECT id FROM products WHERE slug = 'retatrutide'), 0, NULL, NULL, 'REVOKED')
      ON CONFLICT (code) DO NOTHING;
    `);

    // 4. Verification Logs
    console.log('📊 Inserindo logs de telemetria...');
    await client.query(`
      INSERT INTO verification_logs (code_queried, code_id, status_result, ip_address, user_agent, location, times_checked_at_moment, created_at)
      VALUES
      ('RET40M', (SELECT id FROM product_codes WHERE code = 'RET40M'), 'VALID_FIRST_TIME', '189.120.45.10', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'US / Miami', 1, NOW() - INTERVAL '3 hours'),
      ('TRZ75P', (SELECT id FROM product_codes WHERE code = 'TRZ75P'), 'WARNING_MULTIPLE_USE', '177.92.14.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'ES / Madrid', 3, NOW() - INTERVAL '2 hours'),
      ('INVA99', NULL, 'NOT_FOUND', '201.88.192.5', 'Mozilla/5.0 (Android 14; Mobile)', 'MX / Mexico City', 0, NOW() - INTERVAL '1 day'),
      ('USED02', (SELECT id FROM product_codes WHERE code = 'USED02'), 'WARNING_MULTIPLE_USE', '189.40.21.3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'US / New York', 2, NOW() - INTERVAL '1 hour'),
      ('FAKE99', NULL, 'NOT_FOUND', '187.60.10.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'GB / London', 0, NOW() - INTERVAL '4 hours');
    `);

    // 5. Admin User
    console.log('👤 Inserindo usuário administrador...');
    await client.query(`
      INSERT INTO admin_users (email, password_hash, name, role)
      VALUES ('admin@essencepharma.com', '$2a$10$wO0pTfJ9cOQZJkH1Y/K3u.W9t7i3m9rBfE9h0o6z7k9x1w2y3z4a5', 'Chief Security Administrator', 'admin')
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
