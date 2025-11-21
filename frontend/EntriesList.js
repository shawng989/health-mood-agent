// src/components/EntriesList.js
import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function EntriesList() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // explicit absolute URL using env var (avoids hitting CRA dev server)
        const res = await fetch(`${API}/api/moods`, { credentials: "same-origin" });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status}: ${text}`);
        }
        const data = await res.json();
        setMoods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch moods:", err);
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading entries…</div>;
  if (error) return <div style={{ color: "salmon" }}>Error: {error}</div>;

  return (
    <div>
      <h3>Recent Entries</h3>
      {moods.length === 0 ? (
        <div>No mood entries yet</div>
      ) : (
        <ul>
          {moods.map((m) => (
            <li key={m.id}>
              <strong>{m.mood}</strong> — {m.note || "No note"}{" "}
              <small>({m.createdAt ? new Date(m.createdAt).toLocaleString() : "unknown"})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
