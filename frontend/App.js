import React from "react";
import MoodForm from "./components/MoodForm";
import HealthForm from "./components/HealthForm";
import EntriesList from "./components/EntriesList";
import "./styles.css";

export default function App() {
  return (
    <div className="app-root">
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <div className="logo">💚</div>
            <div>
              <h1>Health & Mood</h1>
              <p className="tag">Your simple personal health concierge</p>
            </div>
          </div>
          <nav>
            <button className="btn small ghost">Sign In</button>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="grid">
          <div className="left-column">
            <div className="forms">
              <MoodForm />
              <HealthForm />
            </div>
          </div>

          <aside className="right-column">
            <EntriesList />
          </aside>
        </section>
      </main>

      <footer className="footer">
        <small>Made with care • Local demo only • Data stored in backend/data.db</small>
      </footer>
    </div>
  );
}
