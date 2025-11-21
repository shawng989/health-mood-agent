import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MoodForm({ onCreated }) {
  const [moodValue, setMoodValue] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  async function handleSaveMood(e) {
    e?.preventDefault();
    setSaveError(null);

    if (!moodValue || moodValue.trim() === "") {
      setSaveError("Mood is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        mood: moodValue,
        note: noteValue || "",
        userId: null
      };

      const res = await fetch(`${API}/api/moods`, {
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

      setMoodValue("");
      setNoteValue("");
    } catch (err) {
      console.error("Save mood failed:", err);
      setSaveError(err.message || "Failed to save mood");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSaveMood}>
      <input
        placeholder="Mood (happy, sad...)"
        value={moodValue}
        onChange={(e) => setMoodValue(e.target.value)}
      />
      <input
        placeholder="Note (optional)"
        value={noteValue}
        onChange={(e) => setNoteValue(e.target.value)}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Mood"}
      </button>

      {saveError && (
        <div style={{ color: "salmon", marginTop: 8 }}>
          Error: {saveError}
        </div>
      )}
    </form>
  );
}
