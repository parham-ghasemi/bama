import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/App/ScrollToTop";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import City from "./pages/city/City";
import FAQ from "./pages/faq/FAQ";
import House from "./pages/house/House";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import Listings from "./pages/admin/Listings";
import ListingDetail from "./pages/admin/ListingDetail";
import Bookings from "./pages/admin/Bookings";
import Reports from "./pages/admin/Reports";
import Finance from "./pages/admin/Finance";

export default function App() {
  return (
    <div dir="rtl">
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" />

        <Routes>
          {/* Public site routes */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/city" element={<City />} />
          <Route path="/house" element={<House />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetail />} />

            <Route path="listings" element={<Listings />} />
            <Route path="listings/:id" element={<ListingDetail />} />

            <Route path="bookings" element={<Bookings />} />

            <Route path="reports" element={<Reports />} />
            <Route path="finance" element={<Finance />} />
          </Route>

          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
