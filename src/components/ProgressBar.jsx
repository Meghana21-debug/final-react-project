export default function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const cls = value > max ? "over" : pct >= 80 ? "warn" : "";
  return (
    <div className="progress">
      <div className={`bar ${cls}`} style={{ width: `${pct}%` }} />
    </div>
  );
}