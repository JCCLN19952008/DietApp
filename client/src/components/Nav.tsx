import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-semibold text-white">🥗 Dietetics</span>
        <div className="flex gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-green-400 font-medium' : 'text-gray-400 hover:text-white'}`
            }
          >
            My meals
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-green-400 font-medium' : 'text-gray-400 hover:text-white'}`
            }
          >
            Recipes
          </NavLink>
          <NavLink
            to="/suggest"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-green-400 font-medium' : 'text-gray-400 hover:text-white'}`
            }
          >
            Suggest ✦
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}