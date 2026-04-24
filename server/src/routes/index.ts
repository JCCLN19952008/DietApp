import { Router } from 'express';
import authRouter from './auth';
 
const router = Router();
 
router.get('/ping', (_req, res) => {
  res.json({ message: 'API alive 🥗', ts: new Date().toISOString() });
});
 
router.use('/auth', authRouter);
 
// Day 3: meal logs
// import mealRouter from './meals';
// router.use('/meals', mealRouter);
 
// Day 4: recipes
// import recipeRouter from './recipes';
// router.use('/recipes', recipeRouter);
 
// Day 5: AI suggestions
// import suggestRouter from './suggestions';
// router.use('/suggestions', suggestRouter);
 
export default router;