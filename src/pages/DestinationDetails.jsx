import { useState } from "react";
import { NavLink, Outlet, useParams, useOutletContext, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "../data/countries";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import { toggleWishlist } from "../redux/wishlistSlice";

export default function DestinationDetails() {
  const { code } = useParams();
  const c = countries.find((x) => x.code === code.toUpperCase());
  const dispatch = useDispatch();
  const saved = useSelector((s) => s.wishlist.items.some((i) => i.code === code.toUpperCase()));

  if (!c) {
    return (
      <div className="center">
        <h2>Destination not found</h2>
        <Link className="btn" to="/destinations">Back to destinations</Link>
      </div>
    );
  }

  const item = { code: c.code, name: c.name, flag: c.flag, region: c.region };

  return (
    <>
      <Link to="/destinations" className="muted">← Back</Link>
      <div className="detail-head">
        <img src={c.flag} alt={`${c.name} flag`} className="flag-big" />
        <div>
          <h1>{c.name}</h1>
          <span className="tag">{c.region}</span>
        </div>
        <button className="btn ghost small" onClick={() => dispatch(toggleWishlist(item))}>
          {saved ? "❤️ Saved" : "🤍 Save"}
        </button>
      </div>

      <div className="tabs">
        <NavLink to="" end>Overview</NavLink>
        <NavLink to="tips">Travel Tips</NavLink>
        <NavLink to="budget">Budget Estimate</NavLink>
      </div>

      <div className="card">
        <Outlet context={c} />
      </div>
    </>
  );
}

function Weather({ lat, lon }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=auto`;
  const { data, loading, error } = useFetch(url);

  if (loading) return <Loader text="Loading weather..." />;
  if (error || !data) return <p className="error">Could not load live weather.</p>;
  return (
    <p>
      🌤️ <b>Right now:</b> {data.current.temperature_2m}°C · 💦 {data.current.relative_humidity_2m}% humidity
    </p>
  );
}

export function Overview() {
  const c = useOutletContext();
  const rows = [
    ["🏛️ Capital", c.capital],
    ["🌐 Region", `${c.region} – ${c.subregion}`],
    ["👥 Population", `${c.population.toLocaleString()} (approx.)`],
    ["📐 Area", `${c.area.toLocaleString()} km²`],
    ["💰 Currency", c.currency],
    ["🗣️ Languages", c.languages],
    ["🕒 Time zone", c.tz],
  ];
  return (
    <>
      <Weather lat={c.lat} lon={c.lon} />
      <ul className="plain">
        {rows.map(([k, v]) => (
          <li key={k} className="info-row"><b>{k}</b><span>{v}</span></li>
        ))}
      </ul>
    </>
  );
}

export function Tips() {
  const c = useOutletContext();
  const tips = [
    `Local currency: ${c.currency}. Check exchange rates before you go.`,
    `Main language(s): ${c.languages}. Learn a few basic phrases.`,
    `People drive on the ${c.side} side of the road.`,
    `Time zone: ${c.tz}. Plan for jet lag.`,
    c.landlocked
      ? "Landlocked country, so look for lakes, mountains and cities."
      : "Has a coastline, great for beaches and seafood.",
    `Capital city ${c.capital} is the best starting point for your trip.`,
  ];
  return (
    <ul>
      {tips.map((t) => <li key={t}>✅ {t}</li>)}
    </ul>
  );
}

const daily = { Africa: 3500, Americas: 6000, Asia: 3000, Europe: 7000, Oceania: 7500 };
const styles = { Budget: 1, "Mid-range": 1.8, Luxury: 3.5 };
const split = [["🏨 Stay", 0.4], ["🍽️ Food", 0.25], ["🚌 Transport", 0.2], ["🎟️ Activities", 0.15]];
const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function Budget() {
  const c = useOutletContext();
  const [days, setDays] = useState(7);
  const [people, setPeople] = useState(1);
  const [style, setStyle] = useState("Budget");

  const d = Math.max(1, Number(days) || 1);
  const p = Math.max(1, Number(people) || 1);
  const total = (daily[c.region] || 5000) * styles[style] * d * p;

  return (
    <>
      <div className="filters">
        <div>
          <label>Days</label>
          <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} />
        </div>
        <div>
          <label>Travellers</label>
          <input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
        </div>
        <div>
          <label>Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {Object.keys(styles).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <h2 style={{ marginTop: 0 }}>Estimated total: {inr(total)}</h2>
      <ul className="plain">
        {split.map(([label, share]) => (
          <li key={label} className="info-row">
            <b>{label}</b><span>{inr(total * share)}</span>
          </li>
        ))}
      </ul>
      <p className="muted">Rough estimate in Indian rupees based on average daily costs for the region (excludes flights).</p>
    </>
  );
}