import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
 
export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;   // JSON string array
  instructions: string;
  prep_time_minutes: number;
  tags: string;          // comma-separated
}
 
export function useRecipes(search: string, tag: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
 
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (tag)    params.set('tag', tag);
      const url = `/recipes${params.toString() ? '?' + params.toString() : ''}`;
      const data = await api.get<Recipe[]>(url);
      setRecipes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, [search, tag]);
 
  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);
 
  return { recipes, loading, error };
}
 
export function useRecipe(id: number) {
  const [recipe, setRecipe]   = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
 
  useEffect(() => {
    api.get<Recipe>(`/recipes/${id}`)
      .then(setRecipe)
      .catch((err: any) => setError(err.message || 'Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);
 
  return { recipe, loading, error };
}
 