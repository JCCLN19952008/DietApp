import { useState, FormEvent } from 'react';
import { useMeals } from '../hooks/useMeals';
import { api } from '../lib/api';
import Nav from '../components/Nav';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function displayDate(dateStr: string) {
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

interface SaveFormState {
  mealId: number;
  foodName: string;
  description: string;
  ingredients: string;
  instructions: string;
  prepTime: string;
  tags: string;
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const { meals, loading, addMeal, deleteMeal } = useMeals(selectedDate);

  const [foodName, setFoodName]   = useState('');
  const [quantity, setQuantity]   = useState('');
  const [mealType, setMealType]   = useState<string>('breakfast');
  const [notes, setNotes]         = useState('');
  const [adding, setAdding]       = useState(false);
  const [formError, setFormError] = useState('');

  const [saveForm, setSaveForm]   = useState<SaveFormState | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setAdding(true);
    try {
      await addMeal({
        custom_food_name: foodName,
        quantity_g: parseFloat(quantity),
        meal_type: mealType,
        notes,
      });
      setFoodName(''); setQuantity(''); setNotes('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to add meal');
    } finally {
      setAdding(false);
    }
  }

  async function handleSaveAsRecipe(e: FormEvent) {
    e.preventDefault();
    if (!saveForm) return;
    setSaveError('');
    setSaving(true);
    try {
      await api.post('/recipes', {
        title: saveForm.foodName,
        description: saveForm.description,
        ingredients: JSON.stringify(
        saveForm.ingredients
        ? saveForm.ingredients.split(',').map(i => i.trim())
        : [saveForm.foodName]
        ),
        instructions: saveForm.instructions,
        prep_time_minutes: saveForm.prepTime ? parseInt(saveForm.prepTime) : null,
        tags: saveForm.tags,
      });
      setSaveSuccess(`"${saveForm.foodName}" saved to recipes!`);
      setSaveForm(null);
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  }

  function goToPrevDay() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(formatDate(d));
  }

  function goToNextDay() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const today = formatDate(new Date());
    if (formatDate(d) <= today) setSelectedDate(formatDate(d));
  }

  const isToday = selectedDate === formatDate(new Date());

  const grouped = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter(m => m.meal_type === type);
    return acc;
  }, {} as Record<string, typeof meals>);

  return (
     <div className="min-h-screen bg-gray-900">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Success toast */}
        {saveSuccess && (
          <div className="bg-green-900 border border-green-700 text-green-300 text-sm px-4 py-3 rounded-xl">
            ✓ {saveSuccess}
          </div>
        )}

        {/* Add meal form — only for today */}
        {isToday && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg">
            <h2 className="text-sm font-medium text-gray-300 mb-4">Log a meal</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Food name"
                    value={foodName}
                    onChange={e => setFoodName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <input
                  type="number"
                  placeholder="Quantity (g)"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  required
                  min="1"
                />
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                >
                  {MEAL_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              {formError && <p className="text-red-400 text-xs">{formError}</p>}
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {adding ? 'Adding…' : 'Add meal'}
              </button>
            </form>
          </div>
        )}

        {/* Save as recipe form */}
        {saveForm && (
          <div className="bg-gray-800 border border-green-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-300">
                Save "{saveForm.foodName}" as a recipe
              </h2>
              <button
                onClick={() => setSaveForm(null)}
                className="text-gray-500 hover:text-gray-300 text-lg leading-none"
              >×</button>
            </div>
            <form onSubmit={handleSaveAsRecipe} className="space-y-3">
              <input
                type="text"
                placeholder="Short description"
                value={saveForm.description}
                onChange={e => setSaveForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Ingredients — comma separated e.g. cabbage, salt, pepper"
                value={saveForm.ingredients}
                onChange={e => setSaveForm(prev => prev ? { ...prev, ingredients: e.target.value } : null)}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
              <textarea
                placeholder="Instructions — how is it prepared?"
                value={saveForm.instructions}
                onChange={e => setSaveForm(prev => prev ? { ...prev, instructions: e.target.value } : null)}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none"
                rows={3}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Prep time (min)"
                  value={saveForm.prepTime}
                  onChange={e => setSaveForm(prev => prev ? { ...prev, prepTime: e.target.value } : null)}
                  className="bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  min="1"
                />
                <input
                  type="text"
                  placeholder="Tags e.g. quick,vegan"
                  value={saveForm.tags}
                  onChange={e => setSaveForm(prev => prev ? { ...prev, tags: e.target.value } : null)}
                  className="bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                />
              </div>
              {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save to recipes'}
              </button>
            </form>
          </div>
        )}

        {/* Date navigator */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevDay}
            className="text-gray-500 hover:text-white transition-colors text-lg px-2"
          >←</button>
          <h2 className="text-sm font-medium text-gray-400">
            {displayDate(selectedDate)}
          </h2>
          <button
            onClick={goToNextDay}
            disabled={isToday}
            className="text-gray-500 hover:text-white transition-colors text-lg px-2 disabled:opacity-30"
          >→</button>
        </div>

        {/* Meals list */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : meals.length === 0 ? (
          <p className="text-sm text-gray-500">No meals logged for this day.</p>
        ) : (
          <div className="space-y-4">
            {MEAL_TYPES.filter(t => grouped[t].length > 0).map(type => (
              <div key={type} className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-750 border-b border-gray-700">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{type}</span>
                </div>
                <ul className="divide-y divide-gray-700">
                  {grouped[type].map(meal => (
                    <li key={meal.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-100">{meal.custom_food_name}</p>
                        <p className="text-xs text-gray-500">{meal.quantity_g}g{meal.notes ? ` · ${meal.notes}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSaveForm({
                            mealId: meal.id,
                            foodName: meal.custom_food_name,
                            description: '',
                            ingredients: '',
                            instructions: '',
                            prepTime: '',
                            tags: '',
                          })}
                          className="text-xs text-green-500 hover:text-green-400 transition-colors"
                        >
                          + recipe
                        </button>
                        {isToday && (
                          <button
                            onClick={() => deleteMeal(meal.id)}
                            className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                          >×</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}