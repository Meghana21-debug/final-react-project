import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetails, { Overview, Tips, Budget } from "./pages/DestinationDetails";
import MyTrips from "./pages/MyTrips";
import Expenses from "./pages/Expenses";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:code" element={<DestinationDetails />}>
            <Route index element={<Overview />} />
            <Route path="tips" element={<Tips />} />
            <Route path="budget" element={<Budget />} />
          </Route>
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<h2 className="center">404 – Page not found 🧭</h2>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}