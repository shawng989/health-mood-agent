// src/components/HealthForm.js
import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function HealthForm({ onCreated }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [steps, setSteps] = useState("");
  const [sleep, setSleep] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if ((steps === "" || steps === null) && (sleep === "" || sleep === null)) {
      setError("Please enter steps or sleep");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        date,
        steps: steps === "" ? undefined : Number(steps),
        sleep: sleep === "" ? undefined : Number(sleep),
        note,
        userId: null
      };

      const res = await fetch(`${API}/api/health`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }

      const created = await res.json();
      if (typeof onCreated === "function") onCreated(created);

      setSteps("");
      setSleep("");
      setNote("");
    } catch (err) {
      console.error("Health save failed:", err);
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Steps
          <input type="number" value={steps} onChange={e => setSteps(e.target.value)} />
        </label>
        <label>
          Sleep (hrs)
          <input type="number" step="0.25" value={sleep} onChange={e => setSleep(e.target.value)} />
        </label>
        <label>
          Notes
          <input value={note} onChange={e => setNote(e.target.value)} />
        </label>

        <div style={{ marginTop: 6 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Health"}
          </button>
          {error && <span style={{ color: "salmon", marginLeft: 12 }}>Error: {error}</span>}
        </div>
      </div>
    </form>
  );
}
