import { Router } from 'express';

const router = Router();

// ── Health ping ────────────────────────────────────────────────────────────
router.get('/ping', (_req, res) => {
  res.json({ message: 'API alive 🥗', ts: new Date().toISOString() });
});

// ── Day 2: Auth routes (stub — uncomment when ready) ──────────────────────
// import authRouter from './auth';
// router.use('/auth', authRouter);

// ── Day 3: Meal log routes (stub) ─────────────────────────────────────────
// import mealRouter from './meals';
// router.use('/meals', mealRouter);

// ── Day 4: Recipe routes (stub) ───────────────────────────────────────────
// import recipeRouter from './recipes';
// router.use('/recipes', recipeRouter);

// ── Day 5: AI suggestion routes (stub) ────────────────────────────────────
// import suggestRouter from './suggestions';
// router.use('/suggestions', suggestRouter);

export default router;
