import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar({
  token,
  user,
  onLogout,
  simulatedDelay,
  setSimulatedDelay
}) {
  const location = useLocation();

  // Map route path to chunk name for visual telemetry
  const getChunkName = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Home.chunk.js';
      case '/projects':
        return 'Projects.chunk.js';
      case '/analytics':
        return 'Analytics.chunk.js';
      case '/contact':
        return 'Contact.chunk.js';
      case '/profiler':
        return 'ProfilerDemo.chunk.js';
      default:
        return 'main.bundle.js';
    }
  };

  return (
    <header className="header">
      <div className="header-brand-section">
        <NavLink to="/" className="brand-link">
          <span className="brand-dot" aria-hidden="true" />
          <div className="brand-text">
            <span className="brand-title">TaskFlow</span>
            <span className="brand-version">ITUE301 &bull; Practical 8</span>
          </div>
        </NavLink>

        {/* Dynamic Chunk Indicator */}
        <div className="chunk-pill" title="Current Route Code-Split Chunk">
          <span className="chunk-pulse" />
          <span className="chunk-label">Active Chunk:</span>
          <code className="chunk-name">{getChunkName(location.pathname)}</code>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="header-nav" aria-label="Main Navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          Tasks
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          Projects
          <span className="nav-tag">Lazy</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          Analytics
          <span className="nav-tag">Heavy</span>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          Contact
          <span className="nav-tag">Lazy</span>
        </NavLink>

        <NavLink
          to="/profiler"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          Profiler
        </NavLink>
      </nav>

      {/* Right Controls: Network Simulation Mode & Auth Status */}
      <div className="header-right">
        {/* Network Simulation Selector */}
        <div className="latency-selector" title="Simulate Network Latency for Suspense Fallback demonstration">
          <span className="latency-label">Network Sim:</span>
          <select
            value={simulatedDelay}
            onChange={(e) => setSimulatedDelay(Number(e.target.value))}
            className="latency-select"
          >
            <option value={0}>Fast / Local (0ms)</option>
            <option value={300}>Min-Delay (300ms)</option>
            <option value={800}>Slow 3G (800ms)</option>
          </select>
        </div>

        {/* User Auth Info */}
        {token ? (
          <div className="user-pill">
            <span className="user-email">{user?.email || 'Logged in'}</span>
            <button
              onClick={onLogout}
              className="btn-logout"
              title="Sign Out"
              aria-label="Sign Out"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="user-status-guest">
            <span className="guest-dot" />
            <span className="guest-text">Guest Mode</span>
          </div>
        )}
      </div>
    </header>
  );
}
