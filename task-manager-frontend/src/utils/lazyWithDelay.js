import { lazy } from 'react';

/**
 * lazyWithDelay
 * Supplementary Problem: Adds a minimum delay to React.lazy dynamic import
 * to prevent flickering/flashing of loading skeletons on fast connections (e.g. 300ms).
 *
 * @param {Function} importFn - Dynamic import function, e.g. () => import('./pages/Projects')
 * @param {number} delayMs - Minimum duration in ms before resolving (default 300ms)
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithDelay(importFn, delayMs = 300) {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, delayMs)),
    ]).then(([moduleExports]) => moduleExports)
  );
}
