import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import OwnerLayout from "./components/layout/OwnerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import MyListings from "./pages/owner/MyListings";
import SubmitListing from "./pages/owner/SubmitListing";
import EditListing from "./pages/owner/EditListing";
import OwnerProfile from "./pages/owner/OwnerProfile";
import ReviewQueue from "./pages/ReviewQueue";
import AllListings from "./pages/admin/AllListings";
import ListingDetailAdmin from "./pages/admin/ListingDetailAdmin";
import Owners from "./pages/admin/Owners";
import Settings from "./pages/admin/Settings";

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
        <Route path="edit/:id" element={<EditListing />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>

      {/* Admin dashboard — its own shell, no public Navbar/Footer */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReviewQueue />} />
        <Route path="listings" element={<AllListings />} />
        <Route path="listings/:id" element={<ListingDetailAdmin />} />
        <Route path="owners" element={<Owners />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* All other pages use the Layout shell */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

        {/* Catch-all — redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
