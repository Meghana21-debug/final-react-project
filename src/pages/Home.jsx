import { Link } from "react-router-dom";
import { countries } from "../data/countries";
import CountryCard from "../components/CountryCard";

const featured = ["JPN", "FRA", "ITA", "THA"];

const steps = [
  ["🔍", "Explore", "Browse countries and see key travel facts."],
  ["🧳", "Plan", "Create trips with dates and a budget."],
  ["💸", "Track", "Log expenses and stay under budget."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Plan trips. Track spending. 🌍</h1>
        <p>TripWise helps you explore destinations, set a budget, and never overspend on the road.</p>
        <div className="row">
          <Link className="btn" to="/destinations">Explore Destinations</Link>
          <Link className="btn ghost" to="/trips">Plan a Trip</Link>
        </div>
      </section>

      <h2>Featured destinations</h2>
      <div className="grid">
        {countries.filter((c) => featured.includes(c.code)).map((c) => (
          <CountryCard key={c.code} country={c} />
        ))}
      </div>

      <h2>How it works</h2>
      <div className="grid">
        {steps.map(([icon, title, text]) => (
          <div className="card center" key={title}>
            <div className="emoji">{icon}</div>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}