import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import Nav from '../components/Nav';
 
const ALL_TAGS = ['quick', 'vegan', 'vegetarian', 'high-protein', 'gluten-free', 'breakfast', 'meal-prep', 'no-cook'];
 
export default function Recipes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const { recipes, loading, error } = useRecipes(search, activeTag);
 
  return (
    <div className="min-h-screen bg-gray-900">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        <input
          type="text"
          placeholder="Search recipes or ingredients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500 shadow-sm"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTag === '' ? 'bg-green-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTag === tag ? 'bg-green-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-gray-500">No recipes found.</p>
        ) : (
          <div className="space-y-3">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm cursor-pointer hover:border-green-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-100">{recipe.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{recipe.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    {recipe.prep_time_minutes} min
                  </span>
                </div>
                {recipe.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recipe.tags.split(',').map(t => (
                      <span key={t} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 