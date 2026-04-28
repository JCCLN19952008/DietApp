import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
 
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH  = `file:${path.join(DATA_DIR, 'dietetics.db')}`;
 
let client: Client;
 
export function getDB(): Client {
  if (!client) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    client = createClient({ url: DB_PATH });
  }
  return client;
}
 
export async function initDB(): Promise<void> {
  const db = getDB();
 
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT    UNIQUE NOT NULL,
      password_hash TEXT    NOT NULL,
      name          TEXT    NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
 
    CREATE TABLE IF NOT EXISTS foods (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      name              TEXT NOT NULL,
      calories_per_100g REAL,
      protein_g         REAL,
      carbs_g           REAL,
      fat_g             REAL,
      created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
    );
 
    CREATE TABLE IF NOT EXISTS meal_logs (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      food_id          INTEGER REFERENCES foods(id),
      custom_food_name TEXT,
      quantity_g       REAL    NOT NULL,
      meal_type        TEXT    CHECK(meal_type IN ('breakfast','lunch','dinner','snack')),
      logged_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes            TEXT
    );
 
    CREATE TABLE IF NOT EXISTS recipes (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      title             TEXT NOT NULL,
      description       TEXT,
      ingredients       TEXT NOT NULL,
      instructions      TEXT NOT NULL,
      prep_time_minutes INTEGER,
      tags              TEXT,
      created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
 
  await seedRecipes(db);
 
  console.log('✓ Database ready at', DB_PATH);
}
 
async function seedRecipes(db: Client): Promise<void> {
  const existing = await db.execute({ sql: 'SELECT COUNT(*) as count FROM recipes', args: [] });
  if ((existing.rows[0].count as number) > 0) return;
 
  const recipes = [
    {
      title: 'Greek Salad',
      description: 'A fresh and simple Mediterranean salad.',
      ingredients: JSON.stringify(['tomatoes', 'cucumber', 'red onion', 'olives', 'feta cheese', 'olive oil', 'oregano']),
      instructions: 'Chop tomatoes, cucumber and onion into chunks. Add olives and crumbled feta. Drizzle with olive oil and sprinkle oregano. Toss and serve.',
      prep_time_minutes: 10,
      tags: 'vegan-friendly,quick,no-cook,high-protein',
    },
    {
      title: 'Vegetable Stir Fry',
      description: 'Quick and colourful stir fry with seasonal vegetables.',
      ingredients: JSON.stringify(['broccoli', 'bell pepper', 'carrot', 'garlic', 'soy sauce', 'sesame oil', 'ginger', 'rice']),
      instructions: 'Cook rice. Heat oil in a wok over high heat. Add garlic and ginger, stir for 30 seconds. Add harder vegetables first (carrot, broccoli), then softer ones (pepper). Add soy sauce and sesame oil. Serve over rice.',
      prep_time_minutes: 20,
      tags: 'vegan,quick,high-fibre',
    },
    {
      title: 'Chicken and Chickpea Stew',
      description: 'Hearty and protein-rich stew perfect for meal prep.',
      ingredients: JSON.stringify(['chicken breast', 'chickpeas', 'tomatoes', 'onion', 'garlic', 'cumin', 'paprika', 'olive oil', 'spinach']),
      instructions: 'Sauté onion and garlic in olive oil. Add diced chicken and brown. Add spices, canned tomatoes and chickpeas. Simmer 20 minutes. Stir in spinach at the end.',
      prep_time_minutes: 35,
      tags: 'high-protein,meal-prep,gluten-free',
    },
    {
      title: 'Avocado Toast with Egg',
      description: 'A nutritious and filling breakfast.',
      ingredients: JSON.stringify(['bread', 'avocado', 'eggs', 'lemon juice', 'chilli flakes', 'salt', 'pepper']),
      instructions: 'Toast bread. Mash avocado with lemon juice, salt and pepper. Poach or fry eggs. Spread avocado on toast and top with egg and chilli flakes.',
      prep_time_minutes: 10,
      tags: 'breakfast,quick,high-protein,vegetarian',
    },
    {
      title: 'Lentil Soup',
      description: 'Warming and filling lentil soup, great for colder days.',
      ingredients: JSON.stringify(['red lentils', 'onion', 'carrot', 'garlic', 'cumin', 'turmeric', 'vegetable stock', 'olive oil', 'lemon']),
      instructions: 'Sauté onion, carrot and garlic. Add spices and stir. Add lentils and stock. Simmer 25 minutes until lentils are soft. Blend partially for a creamy texture. Finish with lemon juice.',
      prep_time_minutes: 35,
      tags: 'vegan,high-fibre,meal-prep,gluten-free',
    },
    {
      title: 'Salmon with Roasted Vegetables',
      description: 'Simple baked salmon with a side of roasted seasonal vegetables.',
      ingredients: JSON.stringify(['salmon fillet', 'courgette', 'cherry tomatoes', 'red onion', 'olive oil', 'garlic', 'lemon', 'thyme']),
      instructions: 'Preheat oven to 200°C. Toss vegetables in olive oil and roast 15 minutes. Add salmon to the tray, season with lemon and thyme, bake another 15 minutes.',
      prep_time_minutes: 30,
      tags: 'high-protein,gluten-free,omega-3',
    },
    {
      title: 'Banana Oat Smoothie',
      description: 'Quick and energising breakfast smoothie.',
      ingredients: JSON.stringify(['banana', 'oats', 'milk', 'honey', 'peanut butter', 'cinnamon']),
      instructions: 'Add all ingredients to a blender. Blend until smooth. Serve immediately.',
      prep_time_minutes: 5,
      tags: 'breakfast,quick,no-cook,vegetarian',
    },
    {
      title: 'Pasta Primavera',
      description: 'Light pasta dish loaded with spring vegetables.',
      ingredients: JSON.stringify(['pasta', 'courgette', 'peas', 'asparagus', 'garlic', 'olive oil', 'parmesan', 'lemon', 'basil']),
      instructions: 'Cook pasta. Sauté garlic in olive oil. Add vegetables and cook 5 minutes. Toss with drained pasta, lemon juice and parmesan. Top with fresh basil.',
      prep_time_minutes: 25,
      tags: 'vegetarian,quick,high-fibre',
    },
    {
      title: 'Turkey and Veggie Wrap',
      description: 'A light and protein-packed lunch wrap.',
      ingredients: JSON.stringify(['wholemeal wrap', 'turkey slices', 'lettuce', 'tomato', 'cucumber', 'hummus', 'red pepper']),
      instructions: 'Spread hummus on the wrap. Layer turkey and vegetables. Roll tightly and slice in half.',
      prep_time_minutes: 5,
      tags: 'lunch,quick,no-cook,high-protein',
    },
    {
      title: 'Vegetable Omelette',
      description: 'A simple and versatile egg-based meal for any time of day.',
      ingredients: JSON.stringify(['eggs', 'bell pepper', 'mushrooms', 'spinach', 'onion', 'olive oil', 'salt', 'pepper']),
      instructions: 'Beat eggs with salt and pepper. Sauté vegetables in olive oil until soft. Pour eggs over vegetables. Cook on low heat until set, fold and serve.',
      prep_time_minutes: 15,
      tags: 'breakfast,vegetarian,quick,high-protein,gluten-free',
    },
  ];
 
  for (const recipe of recipes) {
    await db.execute({
      sql: `INSERT INTO recipes (title, description, ingredients, instructions, prep_time_minutes, tags)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [recipe.title, recipe.description, recipe.ingredients, recipe.instructions, recipe.prep_time_minutes, recipe.tags],
    });
  }
 
  console.log('✓ Recipes seeded');
}