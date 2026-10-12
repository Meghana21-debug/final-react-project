import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist, clearWishlist } from "../redux/wishlistSlice";

export default function Wishlist() {
  const items = useSelector((s) => s.wishlist.items);
  const dispatch = useDispatch();

  return (
    <>
      <div className="row between">
        <h1>My Wishlist</h1>
        {items.length > 0 && (
          <button className="btn small danger" onClick={() => dispatch(clearWishlist())}>Clear all</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="center">
          <p className="muted">Your wishlist is empty. Save places you dream of visiting 🌴</p>
          <Link className="btn" to="/destinations">Browse destinations</Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((i) => (
            <div className="card country-card" key={i.code}>
              <img src={i.flag} alt={`${i.name} flag`} />
              <h3>{i.name}</h3>
              <span className="tag">{i.region}</span>
              <div className="row">
                <Link className="btn small" to={`/destinations/${i.code}`}>View</Link>
                <button className="btn small danger" onClick={() => dispatch(toggleWishlist(i))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}