export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader">
      <span className="spinner"></span>
      <p className="muted">{text}</p>
    </div>
  );
}