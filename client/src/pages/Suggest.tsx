import { useState, FormEvent } from 'react';
import { api } from '../lib/api';
import Nav from '../components/Nav';

interface Suggestion {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time_minutes: number;
  nutritional_highlights: string;
}

const PREP_TIMES = [
  { label: '5 min',  value: 5  },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

export default function Suggest() {
  const [input, setInput]             = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [prepTime, setPrepTime]       = useState(30);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  function addIngredient() {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients(prev => [...prev, trimmed]);
    }
    setInput('');
  }

  function removeIngredient(ing: string) {
    setIngredients(prev => prev.filter(i => i !== ing));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    setError('');
    setLoading(true);
    setSuggestions([]);
    try {
      const data = await api.post<{ suggestions: Suggestion[] }>('/suggestions', {
        ingredients,
        prep_time: prepTime,
      });
      setSuggestions(data.suggestions);
    } catch (err: any) {
      setError(err.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg">
          <h2 className="text-sm font-medium text-gray-300 mb-4">
            What ingredients do you have?
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. chicken, tomatoes, garlic…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map(ing => (
                  <span
                    key={ing}
                    className="flex items-center gap-1 bg-green-900 border border-green-700 text-green-300 text-xs px-3 py-1 rounded-full"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing)}
                      className="text-green-500 hover:text-green-300 leading-none ml-1"
                    >×</button>
                  </span>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">How much time do you have?</p>
              <div className="flex gap-2 flex-wrap">
                {PREP_TIMES.map(pt => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPrepTime(pt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      prepTime === pt.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading || ingredients.length === 0}
              className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Getting suggestions…' : 'Suggest recipes'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🤔</div>
            <p className="text-sm text-gray-500">Claude is thinking up recipes for you…</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Suggested for you
            </p>
            {suggestions.map((s, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg space-y-4">

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-100">{s.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    {s.prep_time_minutes} min
                  </span>
                </div>

                {s.nutritional_highlights && (
                  <div className="flex items-center gap-2 bg-green-900 border border-green-700 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-xs">✦</span>
                    <p className="text-xs text-green-300">{s.nutritional_highlights}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Ingredients</p>
                  <div className="flex flex-wrap gap-1">
                    {s.ingredients.map((ing, j) => (
                      <span key={j} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Instructions</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{s.instructions}</p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}