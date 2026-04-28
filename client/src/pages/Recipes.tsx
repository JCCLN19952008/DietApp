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
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
 
        {/* Search */}
        <input
          type="text"
          placeholder="Search recipes or ingredients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:border-green-500 shadow-sm"
        />
 
        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTag === '' ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            All
          </button>
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTag === tag ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
 
        {/* Results */}
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-gray-400">No recipes found.</p>
        ) : (
          <div className="space-y-3">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{recipe.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{recipe.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {recipe.prep_time_minutes} min
                  </span>
                </div>
                {recipe.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recipe.tags.split(',').map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
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
 