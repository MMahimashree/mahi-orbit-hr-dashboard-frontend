import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="navbar glass">
      <div className="navbar-brand">
        <span className="brand-mark">⬢</span>
        <div className="brand-text">
          <h1>Mahi Orbit</h1>
          <span className="brand-sub">Workforce Management</span>
        </div>
      </div>

      <div className="navbar-search">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search employees by name, ID, or department..."
          value={query}
          onChange={handleChange}
        />
      </div>

      <div className="navbar-meta">
        <span className="live-dot" title="Live data from Spring Boot API" />
        <span className="live-label">Live · {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        <div className="navbar-divider" />
        <div className="navbar-user">
  <div className="user-avatar">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
  <div className="user-info">
    <span className="user-name">Admin</span>
    <span className="user-role">HR Manager</span>
  </div>
</div>
      </div>
    </header>
  );
}