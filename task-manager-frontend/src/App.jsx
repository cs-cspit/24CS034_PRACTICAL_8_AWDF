import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingFallback from './components/LoadingFallback';
import './App.css';

/**
 * Step 3 & 4 from Lab Manual:
 * Convert route imports to lazy imports using React.lazy() and dynamic import()
 * Declared outside the component function so they are created once.
 */
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Contact = lazy(() => import('./pages/Contact'));
const ProfilerDemo = lazy(() => import('./pages/ProfilerDemo'));

export default function App() {
  // Global auth state
  const [token, setToken] = useState(() => localStorage.getItem('tm_auth_token') || '');
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState(null);

  // Network simulation delay (0ms, 300ms min-delay, 800ms slow 3G)
  const [simulatedDelay, setSimulatedDelay] = useState(300);

  const showNotice = (text, type = 'info') => {
    setNotice({ text, type });
  };

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleLogout = () => {
    localStorage.removeItem('tm_auth_token');
    setToken('');
    setUser(null);
    showNotice('Signed out successfully', 'info');
  };

  return (
    <div className="app-shell">
      {/* 
        Step 4 from Lab Manual:
        Navbar is placed OUTSIDE the Suspense boundary so that navigation remains 
        interactive, stable, and visible while the route chunk loads underneath.
      */}
      <Navbar
        token={token}
        user={user}
        onLogout={handleLogout}
        simulatedDelay={simulatedDelay}
        setSimulatedDelay={setSimulatedDelay}
      />

      {/* Global Notification Toast */}
      {notice && (
        <div className={`toast toast-${notice.type}`} role="alert">
          <span className="toast-icon">
            {notice.type === 'success' ? '✓' : notice.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="toast-text">{notice.text}</span>
          <button className="toast-close" onClick={() => setNotice(null)}>
            ✕
          </button>
        </div>
      )}

      {/* 
        Step 4 from Lab Manual:
        Wrap the Routes block with Suspense and a meaningful fallback UI:
        <Suspense fallback={<LoadingFallback />}>
          <Routes> ... </Routes>
        </Suspense>
      */}
      <main className="app-main">
        <Suspense fallback={<LoadingFallback routeName="Route Component" />}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  token={token}
                  showNotice={showNotice}
                />
              }
            />
            <Route path="/projects" element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/contact"
              element={<Contact showNotice={showNotice} />}
            />
            <Route path="/profiler" element={<ProfilerDemo />} />
          </Routes>
        </Suspense>
      </main>

      {/* Minimal Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span>ITUE301 &bull; Practical 8: Performance Optimization &amp; Lazy Loading</span>
          <span className="footer-author">Samarth Kalavadia (24CS034) &bull; CHARUSAT</span>
        </div>
      </footer>
    </div>
  );
}
