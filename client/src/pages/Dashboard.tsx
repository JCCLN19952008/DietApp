import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
 
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  function handleLogout() {
    logout();
    navigate('/login');
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm text-center">
        <div className="text-4xl mb-3">🥗</div>
        <h1 className="text-xl font-semibold text-gray-800">
          Hey, {user?.name}!
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          You are logged in as {user?.email}
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Day 3 content coming soon — meal logging dashboard
        </p>
        <button
          onClick={handleLogout}
          className="w-full border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}