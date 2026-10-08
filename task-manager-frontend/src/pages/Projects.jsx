import React, { useState } from 'react';

const INITIAL_PROJECTS = [
  {
    id: 'p1',
    name: 'Frontend Code Splitting & Lazy Loading',
    category: 'Architecture',
    status: 'In Progress',
    progress: 85,
    dueDate: '2026-10-15',
    team: ['Samarth K.', 'Reviewer'],
    summary: 'Split route bundles using React.lazy() & Suspense boundaries with fallback skeletons.',
    tags: ['React 19', 'Vite', 'Code Splitting']
  },
  {
    id: 'p2',
    name: 'JWT Middleware & Security Pipeline',
    category: 'Backend',
    status: 'Completed',
    progress: 100,
    dueDate: '2026-10-01',
    team: ['Samarth K.'],
    summary: 'Bcrypt salt hashing, token verification, and payload validation middleware on Express.',
    tags: ['Express', 'JWT', 'Security']
  },
  {
    id: 'p3',
    name: 'Mongoose Atlas Cluster Synchronization',
    category: 'Database',
    status: 'Completed',
    progress: 100,
    dueDate: '2026-09-24',
    team: ['Samarth K.'],
    summary: 'Cloud MongoDB Atlas connection with automatic schema validation and casting checks.',
    tags: ['MongoDB', 'Mongoose', 'Cloud']
  },
  {
    id: 'p4',
    name: 'Recharts Dynamic Lazy Evaluation',
    category: 'Optimization',
    status: 'In Progress',
    progress: 70,
    dueDate: '2026-10-20',
    team: ['Samarth K.'],
    summary: 'Isolate heavy charting libraries into separated dynamic chunks loaded on demand.',
    tags: ['Recharts', 'Performance', 'Vite']
  }
];

/**
 * Projects (Route-based component)
 * Loaded dynamically via React.lazy() only when `/projects` is visited.
 */
export default function Projects() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Architecture');
  const [newSummary, setNewSummary] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'active') return p.status === 'In Progress';
    if (filter === 'completed') return p.status === 'Completed';
    return true;
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProject = {
      id: `p${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      status: 'In Progress',
      progress: 10,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      team: ['Samarth K.'],
      summary: newSummary.trim() || 'New initiative project workspace',
      tags: ['New', newCategory]
    };

    setProjects([newProject, ...projects]);
    setNewName('');
    setNewSummary('');
    setShowAddModal(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects & Initiatives</h1>
          <p className="page-description">
            Lazy Route Chunk: <code>Projects.chunk.js</code> &bull; Loaded dynamically via <code>React.lazy()</code>
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + New Project
        </button>
      </div>

      {/* Code Splitting Banner */}
      <div className="split-info-banner">
        <span className="split-icon">⚡</span>
        <div className="split-banner-content">
          <span className="split-title">Route-Based Chunk Active</span>
          <p className="split-desc">
            This entire view and its sub-components were downloaded as a separate JavaScript chunk (<code>Projects-*.js</code>) only after you clicked the Projects tab.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="projects-filter-bar">
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Projects ({projects.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter('active')}
          >
            In Progress ({projects.filter((p) => p.status === 'In Progress').length})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({projects.filter((p) => p.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-card-header">
              <span className="project-cat-badge">{proj.category}</span>
              <span
                className={`status-pill ${
                  proj.status === 'Completed' ? 'pill-done' : 'pill-todo'
                }`}
              >
                {proj.status}
              </span>
            </div>

            <h3 className="project-title">{proj.name}</h3>
            <p className="project-summary">{proj.summary}</p>

            {/* Progress bar */}
            <div className="project-progress-section">
              <div className="progress-labels">
                <span className="progress-sub">Milestone Progress</span>
                <span className="progress-percent">{proj.progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${proj.progress}%`,
                    backgroundColor: proj.progress === 100 ? '#10b981' : '#18181b'
                  }}
                />
              </div>
            </div>

            {/* Tags & Due */}
            <div className="project-footer">
              <div className="project-tags">
                {proj.tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="project-due">Due {proj.dueDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Project Workspace</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Profiler Performance Tuning"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Optimization">Optimization</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of project goals and scope..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
