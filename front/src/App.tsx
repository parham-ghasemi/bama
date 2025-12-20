import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/App/ScrollToTop";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import City from "./pages/city/City";
import FAQ from "./pages/faq/FAQ";
import ViewMore from "./pages/faq/viewMore/ViewMore";
import House from "./pages/house/House";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import Listings from "./pages/admin/Listings";
import ListingDetail from "./pages/admin/ListingDetail";
import Bookings from "./pages/admin/Bookings";
import Finance from "./pages/admin/Finance";
import VillaResults from "./pages/villaResults/VillaResults";
import Profile from "./pages/profile/Profile";
import Account from "./pages/profile/pages/account/Account";
import Favorites from "./pages/profile/pages/favorites/Favorites";
import Trips from "./pages/profile/pages/trips/Trips";
import Transactions from "./pages/profile/pages/transactions/Transactions";
import Wallet from "./pages/profile/pages/wallet/Wallet";
import NotFoundPage from "./pages/404/NotFound";

import { TicketsProvider } from "./pages/admin/tickets/TicketsProvider";
import { TicketsPage } from "./pages/admin/tickets/pages/TicketsPage";
import { TicketDetailsPage } from "./pages/admin/tickets/pages/TicketDetailsPage";

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
          <Route path="/villa-results/:city" element={<VillaResults />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/view-more" element={<ViewMore />} />

          <Route path="/profile" element={<Profile />} >
            <Route path="account" element={<Account />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="trips" element={<Trips />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="wallet" element={<Wallet />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<TicketsProvider><AdminLayout /></TicketsProvider>}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetail />} />

            <Route path="listings" element={<Listings />} />
            <Route path="listings/:id" element={<ListingDetail />} />

            <Route path="bookings" element={<Bookings />} />

            <Route path="finance" element={<Finance />} />

            <Route path="tickets" element={<TicketsPage />} />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
          </Route>

          {/* Redirect any unknown route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}