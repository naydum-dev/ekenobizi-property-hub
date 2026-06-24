import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Listings from "./pages/Listings";

// Temporary placeholders — to be replaced with real pages later
function Dashboard() {
  return (
    <div className="p-8 text-center text-gray-500">
      Owner Dashboard — coming soon
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="p-8 text-center text-gray-500">
      Admin Panel — coming soon
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public auth pages — no Navbar/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* All other pages use the Layout shell */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />

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

        {/* Catch-all — redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
