import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import Nav from '../components/Nav';
 
export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, loading, error } = useRecipe(Number(id));
 
  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <p className="text-sm text-gray-400 text-center mt-20">Loading…</p>
    </div>
  );
 
  if (error || !recipe) return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <p className="text-sm text-red-400 text-center mt-20">{error || 'Recipe not found'}</p>
    </div>
  );
 
  const ingredients: string[] = JSON.parse(recipe.ingredients);
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
 
        {/* Back button */}
        <button
          onClick={() => navigate('/recipes')}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back to recipes
        </button>
 
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-semibold text-gray-800">{recipe.title}</h1>
            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-1">
              {recipe.prep_time_minutes} min
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
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
 
        {/* Ingredients */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>
 
        {/* Instructions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Instructions</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{recipe.instructions}</p>
        </div>
 
      </div>
    </div>
  );
}
 