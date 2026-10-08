import React, { useState, useCallback, memo, useEffect, useRef } from 'react';

/**
 * UnmemoizedTaskCounter
 * Re-renders on every parent state change because `onReset` is recreated on every parent render.
 */
function UnmemoizedTaskCounter({ count, onReset }) {
  const [renderCount, setRenderCount] = useState(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setRenderCount((c) => c + 1);
  }, [count, onReset]);

  return (
    <div className="profiler-card profiler-bad">
      <div className="profiler-badge badge-warning">Unmemoized Component</div>
      <h4 className="profiler-comp-title">Standard Child Component</h4>
      <p className="profiler-comp-sub">Re-renders on EVERY parent state update</p>

      <div className="render-counter-box">
        <span className="counter-number red-text">{renderCount}</span>
        <span className="counter-label">Render Cycle Count (Unnecessary Re-renders)</span>
      </div>

      <div className="child-action-row">
        <span>Passed Count: <strong>{count}</strong></span>
        <button className="btn-small" onClick={onReset}>
          Reset
        </button>
      </div>
      <p className="profiler-hint">
        ⚠️ Re-rendered because parent re-rendered, recreating the inline function reference.
      </p>
    </div>
  );
}

/**
 * MemoizedTaskCounter
 * Wrapped in React.memo and receives a memoized useCallback reference.
 * Only re-renders when relevant props actually change!
 */
const MemoizedTaskCounter = memo(function MemoizedTaskCounter({ count, onReset }) {
  const [renderCount, setRenderCount] = useState(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setRenderCount((c) => c + 1);
  }, [count, onReset]);

  return (
    <div className="profiler-card profiler-good">
      <div className="profiler-badge badge-success">Optimized with React.memo</div>
      <h4 className="profiler-comp-title">Memoized Child Component</h4>
      <p className="profiler-comp-sub">Only renders when <code>count</code> or <code>onReset</code> changes</p>

      <div className="render-counter-box">
        <span className="counter-number green-text">{renderCount}</span>
        <span className="counter-label">Render Cycle Count (Optimized)</span>
      </div>

      <div className="child-action-row">
        <span>Passed Count: <strong>{count}</strong></span>
        <button className="btn-small" onClick={onReset}>
          Reset
        </button>
      </div>
      <p className="profiler-hint">
        ✓ Skipped unnecessary re-renders via React.memo shallow prop equality comparison.
      </p>
    </div>
  );
});

export default function ProfilerDemo() {
  const [parentCounter, setParentCounter] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [taskCount, setTaskCount] = useState(5);

  // Unmemoized callback recreated on every render
  const unmemoizedReset = () => {
    setTaskCount(0);
  };

  // Memoized callback with stable reference
  const memoizedReset = useCallback(() => {
    setTaskCount(0);
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">React DevTools Profiler & Memoization Audit</h1>
          <p className="page-description">
            Route Chunk: <code>ProfilerDemo.chunk.js</code> &bull; Supplementary Lab Task 3
          </p>
        </div>
      </div>

      {/* Parent Controls */}
      <div className="card">
        <h2 className="card-title">Parent Component State Controls</h2>
        <p className="card-sub">
          Interact with parent inputs to test which child components re-render unnecessarily:
        </p>

        <div className="controls-row">
          <div className="control-item">
            <label className="form-label">Type in Parent Input:</label>
            <input
              type="text"
              placeholder="Type anything here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="form-input"
            />
            <span className="control-help">Triggers parent re-render on each keystroke</span>
          </div>

          <div className="control-item">
            <label className="form-label">Increment Independent Counter:</label>
            <div className="counter-btn-row">
              <button
                className="btn btn-secondary"
                onClick={() => setParentCounter((c) => c + 1)}
              >
                + Increment ({parentCounter})
              </button>
            </div>
            <span className="control-help">Parent state changes without affecting Child props</span>
          </div>

          <div className="control-item">
            <label className="form-label">Update Task Prop:</label>
            <div className="counter-btn-row">
              <button
                className="btn btn-primary"
                onClick={() => setTaskCount((c) => c + 1)}
              >
                + Add Task ({taskCount})
              </button>
            </div>
            <span className="control-help">Legitimate prop change: both children will update</span>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="profiler-grid">
        <UnmemoizedTaskCounter count={taskCount} onReset={unmemoizedReset} />
        <MemoizedTaskCounter count={taskCount} onReset={memoizedReset} />
      </div>

      {/* React DevTools Profiler Walkthrough */}
      <div className="card">
        <h3 className="card-title">DevTools Profiler Investigation & Fix Guide</h3>
        <div className="profiler-steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h4 className="step-title">Open Profiler Tab</h4>
            <p className="step-desc">
              Open Chrome / Edge DevTools, click on the <strong>Profiler</strong> tab provided by React Developer Tools.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <h4 className="step-title">Start Recording</h4>
            <p className="step-desc">
              Click the circular <strong>Record</strong> button, then interact with the input or buttons above.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <h4 className="step-title">Inspect Flamegraph</h4>
            <p className="step-desc">
              Click <strong>Stop</strong>. Observe commit flamegraph: <code>UnmemoizedTaskCounter</code> rendered while <code>MemoizedTaskCounter</code> was skipped.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">4</div>
            <h4 className="step-title">Root Cause & Resolution</h4>
            <p className="step-desc">
              React re-renders children when parents re-render. Wrapping with <code>React.memo</code> and stabilizing handlers with <code>useCallback</code> eliminates wasted work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
