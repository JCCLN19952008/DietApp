import { Router, Request, Response } from 'express';
import { getDB } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    const date = req.query.date as string | undefined;
    const sql = date
      ? 'SELECT * FROM meal_logs WHERE user_id = ? AND DATE(logged_at) = ? ORDER BY logged_at DESC'
      : 'SELECT * FROM meal_logs WHERE user_id = ? ORDER BY logged_at DESC';
    const args = date ? [req.userId!, date] : [req.userId!];
    const result = await db.execute({ sql, args });
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { custom_food_name, quantity_g, meal_type, notes } = req.body;
  if (!custom_food_name || !quantity_g || !meal_type) {
    res.status(400).json({ error: 'Food name, quantity and meal type are required' });
    return;
  }
  try {
    const db = getDB();
    const result = await db.execute({
      sql: `INSERT INTO meal_logs (user_id, custom_food_name, quantity_g, meal_type, notes)
            VALUES (?, ?, ?, ?, ?)`,
      args: [req.userId!, custom_food_name, Number(quantity_g), meal_type, notes ?? null],
    });
    const inserted = await db.execute({
      sql: 'SELECT * FROM meal_logs WHERE id = ?',
      args: [result.lastInsertRowid!],
    });
    res.status(201).json(inserted.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    await db.execute({
      sql: 'DELETE FROM meal_logs WHERE id = ? AND user_id = ?',
      args: [Number(req.params.id), req.userId!],
    });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;