import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useApp } from "../context/AppContext";

const links = [
  ["/", "Home"], ["/destinations", "Destinations"], ["/trips", "My Trips"],
  ["/expenses", "Expenses"], ["/wishlist", "Wishlist"], ["/contact", "Contact"], ["/profile", "Profile"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useApp();
  const count = useSelector((s) => s.wishlist.items.length);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>✈️ TripWise</Link>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              {label}{label === "Wishlist" && count > 0 ? ` (${count})` : ""}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className="icon-btn burger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}