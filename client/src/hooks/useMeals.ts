import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
 
export interface MealLog {
  id: number;
  custom_food_name: string;
  quantity_g: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes: string | null;
  logged_at: string;
}
 
export interface NewMeal {
  custom_food_name: string;
  quantity_g: number;
  meal_type: string;
  notes?: string;
}
 
export function useMeals(date?: string) {
  const [meals, setMeals]     = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
 
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const url = date ? `/meals?date=${date}` : '/meals';
      const data = await api.get<MealLog[]>(url);
      setMeals(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, [date]);
 
  useEffect(() => { fetchMeals(); }, [fetchMeals]);
 
  async function addMeal(meal: NewMeal) {
    const created = await api.post<MealLog>('/meals', meal);
    setMeals(prev => [created, ...prev]);
  }
 
  async function deleteMeal(id: number) {
    await api.delete(`/meals/${id}`);
    setMeals(prev => prev.filter(m => m.id !== id));
  }
 
  return { meals, loading, error, addMeal, deleteMeal, refetch: fetchMeals };
}
 