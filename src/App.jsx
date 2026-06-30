import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import OwnerLayout from "./components/layout/OwnerLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import MyListings from "./pages/owner/MyListings";
import SubmitListing from "./pages/owner/SubmitListing";
import OwnerProfile from "./pages/owner/OwnerProfile";

// Temporary placeholder — to be replaced with real page later
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

      {/* Owner dashboard — its own shell, no public Navbar/Footer */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MyListings />} />
        <Route path="submit" element={<SubmitListing />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>

      {/* All other pages use the Layout shell */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

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
