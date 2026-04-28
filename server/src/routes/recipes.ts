import { Router, Request, Response } from 'express';
import { getDB } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/recipes — get all recipes, optional ?search= and ?tag= filters
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const search = (req.query.search as string || '').toLowerCase().trim();
    const tag    = (req.query.tag    as string || '').toLowerCase().trim();

    const result = await db.execute({ sql: 'SELECT * FROM recipes ORDER BY title ASC', args: [] });
    let rows = result.rows;

    if (search) {
      rows = rows.filter(r =>
        (r.title as string).toLowerCase().includes(search) ||
        (r.description as string || '').toLowerCase().includes(search) ||
        (r.ingredients as string).toLowerCase().includes(search)
      );
    }

    if (tag) {
      rows = rows.filter(r =>
        (r.tags as string || '').toLowerCase().split(',').map(t => t.trim()).includes(tag)
      );
    }

    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/:id — get single recipe
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const result = await db.execute({
      sql: 'SELECT * FROM recipes WHERE id = ?',
      args: [Number(req.params.id)],
    });

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;