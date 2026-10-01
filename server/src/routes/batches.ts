import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query, pool } from '../db.js';

export const batchesRouter = Router();

// Helper to generate secure alphanumeric pharma code format: XXX-XXX-XXX
function generatePharmaCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous characters: 0, 1, I, O
  let part1 = '';
  let part2 = '';
  let part3 = '';
  const bytes = crypto.randomBytes(9);
  for (let i = 0; i < 3; i++) part1 += chars[bytes[i] % chars.length];
  for (let i = 3; i < 6; i++) part2 += chars[bytes[i] % chars.length];
  for (let i = 6; i < 9; i++) part3 += chars[bytes[i] % chars.length];
  return `${part1}-${part2}-${part3}`;
}

// GET /api/batches - List all batches with stats
batchesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        b.id,
        b.batch_number,
        b.product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.category as product_category,
        b.manufacturing_date,
        b.expiry_date,
        b.total_codes,
        b.active,
        b.notes,
        b.created_at,
        COUNT(c.id) as generated_codes_count,
        COUNT(CASE WHEN c.times_checked > 0 THEN 1 END) as checked_codes_count,
        COUNT(CASE WHEN c.times_checked > 1 THEN 1 END) as fraud_alerts_count
      FROM batches b
      JOIN products p ON p.id = b.product_id
      LEFT JOIN product_codes c ON c.batch_id = b.id
      GROUP BY b.id, p.id
      ORDER BY b.created_at DESC;
    `);

    return res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao listar lotes:', error);
    return res.status(500).json({ error: 'Erro ao buscar lotes no Neon PostgreSQL.' });
  }
});

// GET /api/batches/:id - Get batch by ID
batchesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const batchResult = await query(`
      SELECT 
        b.*,
        p.name as product_name,
        p.slug as product_slug,
        p.purity,
        p.concentration
      FROM batches b
      JOIN products p ON p.id = b.product_id
      WHERE b.id = $1;
    `, [id]);

    if (batchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lote não encontrado.' });
    }

    return res.json(batchResult.rows[0]);
  } catch (error: any) {
    console.error('Erro ao buscar detalhes do lote:', error);
    return res.status(500).json({ error: 'Falha ao buscar lote.' });
  }
});

// GET /api/batches/:id/codes - List codes for a specific batch
batchesRouter.get('/:id/codes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const codesResult = await query(`
      SELECT id, code, times_checked, first_checked_at, last_checked_at, status, created_at
      FROM product_codes
      WHERE batch_id = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3;
    `, [id, limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM product_codes WHERE batch_id = $1;
    `, [id]);

    return res.json({
      total: parseInt(countResult.rows[0]?.total || '0', 10),
      limit,
      offset,
      codes: codesResult.rows
    });
  } catch (error: any) {
    console.error('Erro ao buscar códigos do lote:', error);
    return res.status(500).json({ error: 'Falha ao buscar códigos do lote.' });
  }
});

// POST /api/batches/generate - Generate new batch with automatic unique security codes
batchesRouter.post('/generate', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const {
      batch_number,
      product_id,
      quantity = 50,
      manufacturing_date,
      expiry_date,
      notes
    } = req.body;

    if (!batch_number || !product_id) {
      return res.status(400).json({ error: 'batch_number e product_id são obrigatórios.' });
    }

    const numCodes = Math.min(Math.max(parseInt(quantity, 10) || 10, 1), 5000);

    await client.query('BEGIN');

    // 1. Insert batch
    const batchRes = await client.query(`
      INSERT INTO batches (batch_number, product_id, manufacturing_date, expiry_date, total_codes, notes)
      VALUES ($1, $2, COALESCE($3, CURRENT_DATE), COALESCE($4, CURRENT_DATE + INTERVAL '2 years'), $5, $6)
      RETURNING *;
    `, [
      batch_number,
      product_id,
      manufacturing_date || null,
      expiry_date || null,
      numCodes,
      notes || null
    ]);

    const newBatch = batchRes.rows[0];

    // 2. Generate unique codes set
    const codeSet = new Set<string>();
    while (codeSet.size < numCodes) {
      codeSet.add(generatePharmaCode());
    }
    const codesArray = Array.from(codeSet);

    // 3. Bulk insert into product_codes
    // Using UNNEST or multi-row insert for high performance
    const valuesList: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    for (const code of codesArray) {
      valuesList.push(`($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, 'ACTIVE')`);
      params.push(code, newBatch.id, product_id);
    }

    const insertSql = `
      INSERT INTO product_codes (code, batch_id, product_id, status)
      VALUES ${valuesList.join(', ')}
      ON CONFLICT (code) DO NOTHING;
    `;

    await client.query(insertSql, params);

    await client.query('COMMIT');

    return res.status(201).json({
      message: `Lote ${batch_number} criado com sucesso com ${codesArray.length} códigos de segurança.`,
      batch: newBatch,
      sample_codes: codesArray.slice(0, 5)
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Erro ao gerar lote e códigos:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Já existe um lote com este número de lote.' });
    }
    return res.status(500).json({ error: 'Falha ao gerar lote no banco Neon.' });
  } finally {
    client.release();
  }
});

// PATCH /api/batches/:id/toggle - Toggle active status
batchesRouter.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(`
      UPDATE batches 
      SET active = NOT active, updated_at = NOW() 
      WHERE id = $1 
      RETURNING id, batch_number, active;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lote não encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao alterar status do lote:', error);
    return res.status(500).json({ error: 'Falha ao atualizar lote.' });
  }
});
