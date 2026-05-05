import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { ingredients, prep_time } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400).json({ error: 'At least one ingredient is required' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
    res.status(500).json({ error: 'Anthropic API key not configured' });
    return;
  }

  try {
       const prompt = `You are a helpful dietitian assistant. Based on the following ingredients and available prep time, suggest 2 recipe ideas. For each recipe, provide a title, brief description, the full list of ingredients needed, step-by-step instructions, nutritional highlights, and relevant tags.

Available ingredients: ${ingredients.join(', ')}
Available prep time: ${prep_time || 30} minutes

Respond ONLY with a valid JSON array, no markdown, no backticks, no extra text. Use this exact structure:
[
  {
    "title": "Recipe name",
    "description": "One sentence description",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": "Step by step instructions as a single string",
    "prep_time_minutes": 20,
    "nutritional_highlights": "High protein, rich in fibre",
    "tags": "quick,high-protein,gluten-free"
  }
]

For tags, only use relevant ones from this list: quick, vegan, vegetarian, high-protein, gluten-free, breakfast, meal-prep, no-cook, high-fibre, omega-3`;
       
       

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      res.status(500).json({ error: 'Failed to contact AI service' });
      return;
    }

    const data = await response.json() as {
      content: { type: string; text: string }[];
    };

    const raw = data.content.find(b => b.type === 'text')?.text || '[]';
       const text = raw.replace(/```json|```/g, '').trim();
       const suggestions = JSON.parse(text);

    res.json({ suggestions });
  } 
  catch (err) {
  console.log('Suggestion error:', err);
  res.status(500).json({ error: 'Failed to generate suggestions' });
}

});

export default router;