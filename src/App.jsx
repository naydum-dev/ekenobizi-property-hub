import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import OwnerLayout from "./components/layout/OwnerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/ui/PageLoader";

// Lazy-loaded pages — each becomes its own chunk, only fetched when visited
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Listings = lazy(() => import("./pages/Listings"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const MyListings = lazy(() => import("./pages/owner/MyListings"));
const SubmitListing = lazy(() => import("./pages/owner/SubmitListing"));
const EditListing = lazy(() => import("./pages/owner/EditListing"));
const OwnerProfile = lazy(() => import("./pages/owner/OwnerProfile"));
const ReviewQueue = lazy(() => import("./pages/ReviewQueue"));
const AllListings = lazy(() => import("./pages/admin/AllListings"));
const ListingDetailAdmin = lazy(
  () => import("./pages/admin/ListingDetailAdmin"),
);
const Owners = lazy(() => import("./pages/admin/Owners"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const ActivityLog = lazy(() => import("./pages/admin/ActivityLog"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
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
            <Route path="activity" element={<ActivityLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* All other pages use the Layout shell */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />

            {/* Catch-all — show a real 404 instead of a silent redirect */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
