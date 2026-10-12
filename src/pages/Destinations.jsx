import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { countries } from "../data/countries";
import useDebounce from "../hooks/useDebounce";
import CountryCard from "../components/CountryCard";

const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const region = params.get("region") || "All";
  const sort = params.get("sort") || "name";
  const [text, setText] = useState(params.get("q") || "");
  const q = useDebounce(text);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current.focus(); }, []);

  useEffect(() => {
    const next = new URLSearchParams(params);
    q ? next.set("q", q) : next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line
  }, [q]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next);
  };

  const list = countries
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) &&
        (region === "All" || c.region === region)
    )
    .sort((a, b) =>
      sort === "population" ? b.population - a.population : a.name.localeCompare(b.name)
    );

  return (
    <>
      <h1>Destinations</h1>
      <div className="filters">
        <input
          ref={inputRef}
          placeholder="Search countries..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select value={region} onChange={(e) => update("region", e.target.value)}>
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="population">Sort: Population</option>
        </select>
      </div>

      {list.length === 0 ? (
        <p className="muted center">No destinations found 🏝️</p>
      ) : (
        <>
          <p className="muted">{list.length} destinations</p>
          <div className="grid">
            {list.map((c) => <CountryCard key={c.code} country={c} />)}
          </div>
        </>
      )}
    </>
  );
}