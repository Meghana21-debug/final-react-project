import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import useLocalStorage from "../hooks/useLocalStorage";
import { useApp } from "../context/AppContext";

const empty = { name: "", destination: "", startDate: "", endDate: "", budget: "" };

const daysTo = (date) =>
  Math.ceil((new Date(date) - new Date().setHours(0, 0, 0, 0)) / 86400000);

function status(trip) {
  const start = daysTo(trip.startDate);
  if (start > 0) return `⏳ ${start} day${start > 1 ? "s" : ""} to go`;
  if (daysTo(trip.endDate) >= 0) return "🧳 Happening now";
  return "✅ Completed";
}

export default function MyTrips() {
  const [trips, setTrips] = useLocalStorage("tripwise-trips", []);
  const { user } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => { if (modal) nameRef.current?.focus(); }, [modal]);

  const openAdd = () => { setForm(empty); setErrors({}); setModal(true); };
  const openEdit = (t) => { setForm(t); setErrors({}); setModal(true); };
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "Trip name must be at least 3 characters";
    if (!form.destination.trim()) e.destination = "Destination is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    else if (form.startDate && form.endDate < form.startDate) e.endDate = "End date must be after start date";
    if (!form.budget || Number(form.budget) <= 0) e.budget = "Budget must be greater than 0";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    const trip = { ...form, budget: Number(form.budget) };
    if (form.id) setTrips(trips.map((t) => (t.id === form.id ? trip : t)));
    else setTrips([...trips, { ...trip, id: Date.now() }]);
    setModal(false);
  };

  const remove = (id) => setTrips(trips.filter((t) => t.id !== id));

  return (
    <>
      <div className="row between">
        <h1>My Trips</h1>
        <button className="btn" onClick={openAdd}>+ New Trip</button>
      </div>

      {trips.length === 0 ? (
        <p className="muted center">No trips yet. Plan your first adventure ✈️</p>
      ) : (
        <div className="grid">
          {trips.map((t) => (
            <div className="card" key={t.id}>
              <h3>🧭 {t.name}</h3>
              <span className="tag">{t.destination}</span>
              <p className="muted">📅 {t.startDate} → {t.endDate}</p>
              <p>💰 {t.budget.toLocaleString("en-IN")} {user.currency}</p>
              <p><b>{status(t)}</b></p>
              <div className="row">
                <button className="btn small" onClick={() => openEdit(t)}>Edit</button>
                <button className="btn small danger" onClick={() => remove(t.id)}>Delete</button>
                <Link className="btn small ghost" to="/expenses">Expenses</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={form.id ? "Edit Trip" : "New Trip"} onClose={() => setModal(false)}>
          <form onSubmit={submit} noValidate>
            <label>Trip name</label>
            <input ref={nameRef} name="name" value={form.name} onChange={change} />
            {errors.name && <small className="error">{errors.name}</small>}

            <label>Destination</label>
            <input name="destination" value={form.destination} onChange={change} />
            {errors.destination && <small className="error">{errors.destination}</small>}

            <label>Start date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={change} />
            {errors.startDate && <small className="error">{errors.startDate}</small>}

            <label>End date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={change} />
            {errors.endDate && <small className="error">{errors.endDate}</small>}

            <label>Budget ({user.currency})</label>
            <input type="number" name="budget" value={form.budget} onChange={change} />
            {errors.budget && <small className="error">{errors.budget}</small>}

            <button className="btn" type="submit">{form.id ? "Update" : "Save"}</button>
          </form>
        </Modal>
      )}
    </>
  );
}