import { useReducer, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import ProgressBar from "../components/ProgressBar";
import { useApp } from "../context/AppContext";

const KEY = "tripwise-expenses";
const categories = ["Food", "Stay", "Transport", "Fun"];
const icons = { Food: "🍽️", Stay: "🏨", Transport: "🚌", Fun: "🎟️" };

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { ...action.payload, id: Date.now() }];
    case "EDIT":
      return state.map((e) => (e.id === action.payload.id ? action.payload : e));
    case "DELETE":
      return state.filter((e) => e.id !== action.payload);
    case "RESET":
      return state.filter((e) => String(e.tripId) !== String(action.payload));
    default:
      return state;
  }
}

const empty = { title: "", amount: "", category: "Food" };

export default function Expenses() {
  const [trips] = useLocalStorage("tripwise-trips", []);
  const { user } = useApp();
  const [tripId, setTripId] = useState(trips[0] ? String(trips[0].id) : "");
  const [expenses, dispatch] = useReducer(reducer, [], () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { titleRef.current?.focus(); }, [tripId]);

  if (trips.length === 0) {
    return (
      <div className="center">
        <h1>Expense Tracker</h1>
        <p className="muted">Create a trip first to start tracking expenses.</p>
        <Link className="btn" to="/trips">Plan a trip</Link>
      </div>
    );
  }

  const trip = trips.find((t) => String(t.id) === tripId) || trips[0];
  const list = expenses.filter((e) => String(e.tripId) === String(trip.id));
  const total = list.reduce((sum, e) => sum + e.amount, 0);
  const remaining = trip.budget - total;
  const fmt = (n) => n.toLocaleString("en-IN");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const err = {};
    if (form.title.trim().length < 3) err.title = "Title must be at least 3 characters";
    if (!form.amount || Number(form.amount) <= 0) err.amount = "Amount must be greater than 0";
    setErrors(err);
    if (Object.keys(err).length) return;
    const payload = { ...form, amount: Number(form.amount), tripId: trip.id };
    dispatch({ type: form.id ? "EDIT" : "ADD", payload });
    setForm(empty);
  };

  const reset = () => {
    if (window.confirm("Delete all expenses for this trip?")) dispatch({ type: "RESET", payload: trip.id });
  };

  return (
    <>
      <h1>Expense Tracker</h1>
      <select value={String(trip.id)} onChange={(e) => { setTripId(e.target.value); setForm(empty); }}>
        {trips.map((t) => <option key={t.id} value={t.id}>{t.name} – {t.destination}</option>)}
      </select>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row between">
          <span>Spent: <b>{fmt(total)} {user.currency}</b></span>
          <span>Budget: <b>{fmt(trip.budget)} {user.currency}</b></span>
        </div>
        <ProgressBar value={total} max={trip.budget} />
        {remaining < 0 ? (
          <p className="error"><b>⚠️ Over budget by {fmt(Math.abs(remaining))} {user.currency}</b></p>
        ) : (
          <p className="success">💚 {fmt(remaining)} {user.currency} remaining</p>
        )}
      </div>

      <div className="two-col">
        <form className="card" onSubmit={submit} noValidate>
          <h3>{form.id ? "Edit expense" : "Add expense"}</h3>
          <label>Title</label>
          <input ref={titleRef} name="title" value={form.title} onChange={change} />
          {errors.title && <small className="error">{errors.title}</small>}

          <label>Amount ({user.currency})</label>
          <input type="number" name="amount" value={form.amount} onChange={change} />
          {errors.amount && <small className="error">{errors.amount}</small>}

          <label>Category</label>
          <select name="category" value={form.category} onChange={change}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <div className="row">
            <button className="btn" type="submit">{form.id ? "Update" : "Add"}</button>
            {form.id && <button className="btn ghost" type="button" onClick={() => { setForm(empty); setErrors({}); }}>Cancel</button>}
          </div>
        </form>

        <div className="card">
          <h3>Breakdown</h3>
          {categories.map((cat) => {
            const sum = list.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div className="row between">
                  <span>{icons[cat]} {cat}</span>
                  <b>{fmt(sum)}</b>
                </div>
                <ProgressBar value={sum} max={total || 1} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="row between" style={{ marginTop: 20 }}>
        <h2 style={{ margin: 0 }}>Expenses</h2>
        {list.length > 0 && <button className="btn small danger" onClick={reset}>Reset all</button>}
      </div>

      {list.length === 0 ? (
        <p className="muted center">No expenses logged yet 💸</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          {list.map((e) => (
            <div className="card expense" key={e.id}>
              <div>
                <b>{icons[e.category]} {e.title}</b>
                <p className="muted">{e.category}</p>
              </div>
              <div className="row">
                <b>{fmt(e.amount)}</b>
                <button className="btn small" onClick={() => { setForm(e); setErrors({}); }}>Edit</button>
                <button className="btn small danger" onClick={() => dispatch({ type: "DELETE", payload: e.id })}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}