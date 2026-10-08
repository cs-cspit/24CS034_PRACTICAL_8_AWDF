import React from 'react';

/**
 * LoadingFallback
 * Meaningful fallback UI rendered by React.Suspense while a lazy chunk downloads.
 * Minimal, subtle design with animated pulse skeleton and chunk metadata.
 */
export default function LoadingFallback({ routeName = 'chunk' }) {
  return (
    <div className="fallback-container" role="status" aria-live="polite">
      <div className="fallback-card">
        <div className="fallback-header">
          <div className="fallback-spinner" aria-hidden="true" />
          <div className="fallback-text-group">
            <h3 className="fallback-title">Loading {routeName}...</h3>
            <p className="fallback-subtitle">
              Suspense boundary active &bull; Downloading route chunk
            </p>
          </div>
          <span className="fallback-badge">Code-Split</span>
        </div>

        {/* Subtle Skeleton Placeholder Grid */}
        <div className="fallback-skeleton-grid">
          <div className="skeleton-bar skeleton-title" />
          <div className="skeleton-bar skeleton-subtitle" />
          <div className="skeleton-cards">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
        </div>

        <div className="fallback-footer">
          <span className="fallback-note">
            ⚡ Chunk will execute automatically upon completion of network transfer.
          </span>
        </div>
      </div>
    </div>
  );
}
