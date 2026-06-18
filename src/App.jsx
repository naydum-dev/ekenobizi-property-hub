import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function Dashboard() {
  return (
    <div className="min-h-screen bg-brand-green-deep flex items-center justify-center">
      <h1 className="text-brand-gold text-3xl font-bold">
        Owner Dashboard (Protected)
      </h1>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="min-h-screen bg-brand-green-deep flex items-center justify-center">
      <h1 className="text-brand-gold text-3xl font-bold">
        Admin Panel (Admins Only)
      </h1>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-brand-green-deep flex items-center justify-center">
            <h1 className="text-brand-gold text-3xl font-bold">
              Supabase Connected
            </h1>
          </div>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
