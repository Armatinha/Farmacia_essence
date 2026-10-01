import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { query } from '../db.js';

export const productsRouter = Router();

// POST /api/products/upload-image - Upload product presentation photo
productsRouter.post('/upload-image', async (req: Request, res: Response) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!dataUrl || !filename) {
      return res.status(400).json({ error: 'dataUrl and filename are required.' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid data URL format.' });
    }

    const ext = path.extname(filename) || '.png';
    const cleanBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}-${cleanBase}${ext}`;
    const buffer = Buffer.from(matches[2], 'base64');

    const publicDir = path.resolve(process.cwd(), 'public', 'products');
    await fs.promises.mkdir(publicDir, { recursive: true });
    await fs.promises.writeFile(path.join(publicDir, safeFilename), buffer);

    const distDir = path.resolve(process.cwd(), 'dist', 'products');
    if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
      await fs.promises.mkdir(distDir, { recursive: true });
      await fs.promises.writeFile(path.join(distDir, safeFilename), buffer);
    }

    return res.json({
      url: `/products/${safeFilename}`,
      message: 'Product image uploaded successfully.'
    });
  } catch (error: any) {
    console.error('Error saving uploaded product image:', error);
    return res.status(500).json({ error: 'Failed to save product image.' });
  }
});

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
    console.error('Error listing products:', error);
    return res.status(500).json({ error: 'Failed to retrieve product catalog.' });
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
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Failed to load product details.' });
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
      category = 'Peptides',
      purity = '≥ 99.0% HPLC',
      description,
      presentations,
      image_url
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
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
    console.error('Error creating product:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A product with this slug already exists.' });
    }
    return res.status(500).json({ error: 'Failed to save product in Neon database.' });
  }
});

// POST /api/products/bulk - Bulk import products (Admin)
productsRouter.post('/bulk', async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Array of products is required.' });
    }

    const inserted: any[] = [];
    for (const p of products) {
      if (!p.name) continue;
      const cleanSlug = (p.slug || p.name.toLowerCase().trim()).replace(/[^a-z0-9-]/g, '-');
      const resQuery = await query(
        `INSERT INTO products (name, slug, concentration, formula, category, purity, description, presentations, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           concentration = COALESCE(EXCLUDED.concentration, products.concentration),
           formula = COALESCE(EXCLUDED.formula, products.formula),
           category = COALESCE(EXCLUDED.category, products.category),
           purity = COALESCE(EXCLUDED.purity, products.purity),
           description = COALESCE(EXCLUDED.description, products.description),
           presentations = COALESCE(EXCLUDED.presentations, products.presentations),
           image_url = COALESCE(EXCLUDED.image_url, products.image_url)
         RETURNING *;`,
        [
          p.name,
          cleanSlug,
          p.concentration || '',
          p.formula || '',
          p.category || 'Peptides',
          p.purity || '≥ 99.0% HPLC',
          p.description || '',
          p.presentations || '',
          p.image_url || '/essence-vials.png'
        ]
      );
      if (resQuery.rows.length > 0) {
        inserted.push(resQuery.rows[0]);
      }
    }

    return res.status(201).json({
      message: `Successfully processed ${inserted.length} products into Neon database.`,
      products: inserted
    });
  } catch (error: any) {
    console.error('Error importing products in bulk:', error);
    return res.status(500).json({ error: 'Failed to bulk import products into Neon database.' });
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
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - Delete product (Admin)
productsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id, name;', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    return res.json({ message: 'Product deleted successfully.', product: result.rows[0] });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});
