import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
 
// Day 4+
// import Recipes      from './pages/Recipes';
// import RecipeDetail from './pages/RecipeDetail';
 
// Day 5+
// import Suggest from './pages/Suggest';
 
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
 
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
 
          {/* Day 4+ */}
          {/* <Route path="/recipes"     element={<PrivateRoute><Recipes /></PrivateRoute>} /> */}
          {/* <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} /> */}
 
          {/* Day 5+ */}
          {/* <Route path="/suggest" element={<PrivateRoute><Suggest /></PrivateRoute>} /> */}
 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
 
export default App;