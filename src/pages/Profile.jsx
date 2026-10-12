import { useState } from "react";
import { useSelector } from "react-redux";
import { useApp } from "../context/AppContext";
import useLocalStorage from "../hooks/useLocalStorage";

const currencies = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "AED"];

export default function Profile() {
  const { user, setUser, theme, toggleTheme } = useApp();
  const [trips] = useLocalStorage("tripwise-trips", []);
  const [expenses] = useLocalStorage("tripwise-expenses", []);
  const wishlist = useSelector((s) => s.wishlist.items);
  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const change = (e) => { setSaved(false); setForm({ ...form, [e.target.name]: e.target.value }); };

  const save = (ev) => {
    ev.preventDefault();
    const err = {};
    if (form.name.trim().length < 3) err.name = "Name must be at least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email";
    setErrors(err);
    if (Object.keys(err).length) return;
    setUser(form);
    setSaved(true);
  };

  return (
    <div className="narrow">
      <h1>👤 Profile</h1>
      <div className="grid">
        <div className="card center"><h2>{trips.length}</h2><p className="muted">Trips planned</p></div>
        <div className="card center"><h2>{wishlist.length}</h2><p className="muted">Wishlist</p></div>
        <div className="card center"><h2>{totalSpent.toLocaleString("en-IN")}</h2><p className="muted">Total spent</p></div>
      </div>

      <form className="card" onSubmit={save} noValidate>
        <label>Name</label>
        <input name="name" value={form.name} onChange={change} />
        {errors.name && <small className="error">{errors.name}</small>}

        <label>Email</label>
        <input name="email" value={form.email} onChange={change} />
        {errors.email && <small className="error">{errors.email}</small>}

        <label>Home currency</label>
        <select name="currency" value={form.currency} onChange={change}>
          {currencies.map((c) => <option key={c}>{c}</option>)}
        </select>

        <button className="btn" type="submit">Save profile</button>
        {saved && <p className="success">Saved!</p>}
      </form>

      <div className="card row between">
        <span>Theme: <b>{theme}</b></span>
        <button className="btn ghost" onClick={toggleTheme}>Switch theme</button>
      </div>
    </div>
  );
}