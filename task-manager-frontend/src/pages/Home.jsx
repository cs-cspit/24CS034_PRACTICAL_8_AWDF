import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

// Default tasks for offline / demonstration
const INITIAL_DEMO_TASKS = [
  {
    _id: '1',
    title: 'Implement React.lazy() and Suspense for Route Chunks',
    description: 'Code-split Projects and Contact routes to shrink initial bundle size.',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Measure Bundle Size Before & After Optimization',
    description: 'Compare Vite build outputs and DevTools Network tab transfer sizes.',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Lazy Load Heavy Recharts Analytics Component',
    description: 'Isolate third-party chart library into a dynamic chunk loaded on demand.',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Audit Component Re-renders using React DevTools Profiler',
    description: 'Identify unnecessary renders and memoize props with React.memo and useCallback.',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export default function Home({ token, showNotice }) {
  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tm_local_tasks');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_TASKS;
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [loading, setLoading] = useState(false);

  // Edit task modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tm_local_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Try fetching tasks from backend if token exists
  useEffect(() => {
    let isMounted = true;
    if (!token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTasks(data);
          }
        }
      } catch {
        // Offline fallback is silent
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotice?.('Task title cannot be empty', 'error');
      return;
    }

    const newTask = {
      _id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title: newTask.title, description: newTask.description })
        });
        if (res.ok) {
          const savedTask = await res.json();
          setTasks((prev) => [savedTask, ...prev]);
          setTitle('');
          setDescription('');
          showNotice?.('Task created successfully', 'success');
          return;
        }
      } catch {
        // Fallback to local
      }
    }

    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setDescription('');
    showNotice?.('Task saved locally', 'success');
  };

  // Toggle completion
  const handleToggleTask = async (task) => {
    const updatedStatus = !task.completed;
    if (token && task._id.length === 24) {
      try {
        const res = await fetch(`${API_BASE}/tasks/${task._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ completed: updatedStatus })
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
          return;
        }
      } catch {
        // Fallback to local
      }
    }
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: updatedStatus } : t))
    );
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (token && id.length === 24) {
      try {
        await fetch(`${API_BASE}/tasks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Fallback
      }
    }
    setTasks((prev) => prev.filter((t) => t._id !== id));
    showNotice?.('Task deleted', 'info');
  };

  // Edit task save
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      showNotice?.('Title is required', 'error');
      return;
    }
    if (token && editingTask._id.length === 24) {
      try {
        const res = await fetch(`${API_BASE}/tasks/${editingTask._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title: editTitle.trim(), description: editDescription.trim() })
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? updated : t)));
          setEditingTask(null);
          showNotice?.('Task updated', 'success');
          return;
        }
      } catch {
        // Fallback
      }
    }
    setTasks((prev) =>
      prev.map((t) =>
        t._id === editingTask._id
          ? { ...t, title: editTitle.trim(), description: editDescription.trim() }
          : t
      )
    );
    setEditingTask(null);
    showNotice?.('Task updated', 'success');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks & Workstream Dashboard</h1>
          <p className="page-description">
            Initial route chunk: <code>Home.chunk.js</code> &bull; Loaded upfront on first visit
          </p>
        </div>
        <div className="page-metrics-pills">
          <span className="pill pill-neutral">Total: {totalCount}</span>
          <span className="pill pill-success">Done: {completedCount}</span>
          <span className="pill pill-warning">Pending: {pendingCount}</span>
          <span className="pill pill-info">{completionPercentage}% Completed</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Create Task Form */}
        <div className="card create-task-card">
          <h2 className="card-title">Create New Task</h2>
          <p className="card-sub">Add a work item to track status and progress</p>

          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-group">
              <label htmlFor="task-title" className="form-label">Task Title</label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Audit bundle with Rollup Visualizer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-desc" className="form-label">Description (Optional)</label>
              <textarea
                id="task-desc"
                placeholder="Technical notes, acceptance criteria, or PR link..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              + Add Task
            </button>
          </form>

          {/* Educational Note regarding Code Splitting */}
          <div className="info-callout">
            <span className="info-icon">💡</span>
            <div className="info-text">
              <strong>Code Splitting Architecture:</strong>
              <p>
                This Home dashboard is served on <code>/</code>. Other sections
                (Projects, Analytics, Contact) are lazy-loaded via <code>React.lazy()</code> so the
                initial browser download payload remains lean.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Task List & Filters */}
        <div className="card task-list-card">
          <div className="task-list-header">
            <div className="filter-tabs">
              <button
                className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({totalCount})
              </button>
              <button
                className={`filter-btn ${filter === 'pending' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button
                className={`filter-btn ${filter === 'completed' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({completedCount})
              </button>
            </div>

            <span className="tasks-count-label">
              Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-subtle" />
              <span>Syncing tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <p className="empty-title">No tasks found</p>
              <p className="empty-sub">
                {filter === 'completed'
                  ? 'No completed tasks yet. Finish a task to see it here!'
                  : 'All caught up! Add a new task using the form on the left.'}
              </p>
            </div>
          ) : (
            <ul className="tasks-ul">
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className={`task-row ${task.completed ? 'task-row-completed' : ''}`}
                >
                  <button
                    type="button"
                    className={`checkbox-custom ${task.completed ? 'checkbox-checked' : ''}`}
                    onClick={() => handleToggleTask(task)}
                    title={task.completed ? 'Mark pending' : 'Mark completed'}
                    aria-label="Toggle task completion"
                  >
                    {task.completed && <span>✓</span>}
                  </button>

                  <div className="task-content">
                    <span className={`task-title-text ${task.completed ? 'strike' : ''}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="task-desc-text">{task.description}</p>
                    )}
                    <div className="task-meta">
                      <span className={`status-pill ${task.completed ? 'pill-done' : 'pill-todo'}`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                      <span className="task-time">
                        {new Date(task.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      className="btn-icon"
                      title="Edit Task"
                      onClick={() => {
                        setEditingTask(task);
                        setEditTitle(task.title);
                        setEditDescription(task.description || '');
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      title="Delete Task"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="modal-backdrop" onClick={() => setEditingTask(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Task</h3>
              <button
                className="btn-close"
                onClick={() => setEditingTask(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
