// components/NeighborhoodChecklist.jsx
import { useNeighborhoods } from "../utils/useNeighborhoods";

export default function NeighborhoodChecklist({ selected = [], onChange, className = "" }) {
  const { neighborhoods, loading } = useNeighborhoods();

  function toggle(name) {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  }

  if (loading) {
    return <p style={{ fontSize: "13px", color: "#888780" }}>Loading neighborhoods…</p>;
  }

  if (neighborhoods.length === 0) {
    return <p style={{ fontSize: "13px", color: "#888780" }}>No neighborhoods have been added yet.</p>;
  }

  return (
    <div className={`neighborhood-checklist ${className}`}>
      {neighborhoods.map((n) => (
        <label key={n._id} className="neighborhood-check-item">
          <input
            type="checkbox"
            checked={selected.includes(n.name)}
            onChange={() => toggle(n.name)}
          />
          {n.name}
        </label>
      ))}
    </div>
  );
}
