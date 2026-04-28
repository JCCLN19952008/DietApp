import { useState, FormEvent } from 'react';
import { useMeals } from '../hooks/useMeals';
import Nav from '../components/Nav';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function Dashboard() {
  const { meals, loading, addMeal, deleteMeal } = useMeals(today());

  const [foodName, setFoodName]   = useState('');
  const [quantity, setQuantity]   = useState('');
  const [mealType, setMealType]   = useState<string>('breakfast');
  const [notes, setNotes]         = useState('');
  const [adding, setAdding]       = useState(false);
  const [formError, setFormError] = useState('');

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

  const grouped = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter(m => m.meal_type === type);
    return acc;
  }, {} as Record<string, typeof meals>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Log a meal</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Quantity (g)"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                required
                min="1"
              />
              <select
                value={mealType}
                onChange={e => setMealType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 bg-white"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
            {formError && <p className="text-red-500 text-xs">{formError}</p>}
            <button
              type="submit"
              disabled={adding}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {adding ? 'Adding…' : 'Add meal'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Today — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : meals.length === 0 ? (
            <p className="text-sm text-gray-400">No meals logged yet today.</p>
          ) : (
            <div className="space-y-4">
              {MEAL_TYPES.filter(t => grouped[t].length > 0).map(type => (
                <div key={type} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{type}</span>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {grouped[type].map(meal => (
                      <li key={meal.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{meal.custom_food_name}</p>
                          <p className="text-xs text-gray-400">{meal.quantity_g}g{meal.notes ? ` · ${meal.notes}` : ''}</p>
                        </div>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                        >×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}