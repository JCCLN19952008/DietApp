import { Router } from 'express';
import authRouter    from './auth';
import mealRouter    from './meals';
import recipeRouter  from './recipes';
import suggestRouter from './suggestions';

const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ message: 'API alive 🥗', ts: new Date().toISOString() });
});

router.use('/auth',        authRouter);
router.use('/meals',       mealRouter);
router.use('/recipes',     recipeRouter);
router.use('/suggestions', suggestRouter);

export default router;