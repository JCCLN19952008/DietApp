import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';

// Day 2 — uncomment as you build each page
// import Login     from './pages/Login';
// import Register  from './pages/Register';

// Day 3+
// import Dashboard from './pages/Dashboard';
// import MealLog   from './pages/MealLog';

// Day 4+
// import Recipes   from './pages/Recipes';
// import RecipeDetail from './pages/RecipeDetail';

// Day 5+
// import Suggest   from './pages/Suggest';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/"          element={<Home />} />

        {/* Day 2 */}
        {/* <Route path="/login"    element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Day 3+ (protected — wrap with <PrivateRoute> once auth exists) */}
        {/* <Route path="/dashboard"      element={<Dashboard />} /> */}
        {/* <Route path="/log"            element={<MealLog />} /> */}
        {/* <Route path="/recipes"        element={<Recipes />} /> */}
        {/* <Route path="/recipes/:id"    element={<RecipeDetail />} /> */}
        {/* <Route path="/suggest"        element={<Suggest />} /> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
