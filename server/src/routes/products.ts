import { Router, Request, Response } from 'express';
import { query } from '../db.js';

export const productsRouter = Router();

// GET /api/products - List products
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { all } = req.query;
    let sql = 'SELECT * FROM products';
    if (all !== 'true') {
      sql += ' WHERE is_active = true';
    }
    sql += ' ORDER BY id ASC';

    const result = await query(sql);
    return res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ error: 'Erro ao buscar catálogo de produtos.' });
  }
});

// GET /api/products/:id - Get single product
productsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const sql = isNumeric
      ? 'SELECT * FROM products WHERE id = $1'
      : 'SELECT * FROM products WHERE slug = $1';

    const result = await query(sql, [isNumeric ? parseInt(id, 10) : id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ error: 'Erro ao carregar detalhes do produto.' });
  }
});

// POST /api/products - Create product (Admin)
productsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      concentration,
      formula,
      category = 'Peptídeos',
      purity = '≥ 99.0% HPLC',
      description,
      presentations,
      image_url
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Nome e slug são obrigatórios.' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    const result = await query(
      `INSERT INTO products (name, slug, concentration, formula, category, purity, description, presentations, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *;`,
      [name, cleanSlug, concentration, formula, category, purity, description, presentations, image_url]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Já existe um produto com este slug.' });
    }
    return res.status(500).json({ error: 'Falha ao salvar produto no Neon PostgreSQL.' });
  }
});

// PUT /api/products/:id - Update product (Admin)
productsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      concentration,
      formula,
      category,
      purity,
      description,
      presentations,
      image_url,
      is_active
    } = req.body;

    const result = await query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           concentration = COALESCE($3, concentration),
           formula = COALESCE($4, formula),
           category = COALESCE($5, category),
           purity = COALESCE($6, purity),
           description = COALESCE($7, description),
           presentations = COALESCE($8, presentations),
           image_url = COALESCE($9, image_url),
           is_active = COALESCE($10, is_active),
           updated_at = NOW()
       WHERE id = $11
       RETURNING *;`,
      [name, slug, concentration, formula, category, purity, description, presentations, image_url, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ error: 'Falha ao atualizar produto.' });
  }
});

// DELETE /api/products/:id - Delete product (Admin)
productsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id, name;', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    return res.json({ message: 'Produto removido com sucesso.', product: result.rows[0] });
  } catch (error: any) {
    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({ error: 'Falha ao excluir produto.' });
  }
});
