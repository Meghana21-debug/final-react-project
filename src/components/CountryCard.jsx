import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";

export default function CountryCard({ country }) {
  const dispatch = useDispatch();
  const saved = useSelector((s) => s.wishlist.items.some((i) => i.code === country.code));

  const item = {
    code: country.code,
    name: country.name,
    flag: country.flag,
    region: country.region,
  };

  return (
    <div className="card country-card">
      <button className="fav" onClick={() => dispatch(toggleWishlist(item))} aria-label="Wishlist">
        {saved ? "❤️" : "🤍"}
      </button>
      <img src={country.flag} alt={`${country.name} flag`} loading="lazy" />
      <h3>{country.name}</h3>
      <p className="muted">📍 {country.capital} · {country.region}</p>
      <p className="muted">👥 {country.population.toLocaleString()}</p>
      <Link className="btn small" to={`/destinations/${country.code}`}>Explore</Link>
    </div>
  );
}