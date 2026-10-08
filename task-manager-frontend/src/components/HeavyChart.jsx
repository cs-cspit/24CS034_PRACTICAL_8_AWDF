import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const STATUS_DATA = [
  { name: 'Completed', count: 18, fill: '#10b981' },
  { name: 'In Progress', count: 9, fill: '#3b82f6' },
  { name: 'Pending Review', count: 5, fill: '#f59e0b' },
  { name: 'Blocked', count: 2, fill: '#ef4444' }
];

const WEEKLY_DATA = [
  { day: 'Mon', completed: 3, created: 4 },
  { day: 'Tue', completed: 5, created: 2 },
  { day: 'Wed', completed: 2, created: 6 },
  { day: 'Thu', completed: 7, created: 3 },
  { day: 'Fri', completed: 6, created: 5 },
  { day: 'Sat', completed: 4, created: 1 },
  { day: 'Sun', completed: 2, created: 0 }
];

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

/**
 * HeavyChart
 * Heavy third-party charting component utilizing Recharts.
 * Bundled as a standalone chunk and loaded on-demand.
 */
export default function HeavyChart() {
  return (
    <div className="heavy-chart-container">
      <div className="chart-banner">
        <div className="chart-badge-row">
          <span className="badge badge-success">✓ Recharts Chunk Loaded Dynamically</span>
          <span className="badge badge-subtle">Bundle: ~350 kB isolated</span>
        </div>
        <p className="chart-description">
          This heavy third-party visualization library was downloaded only when requested.
          The initial bundle for <code>/</code> was spared the overhead!
        </p>
      </div>

      <div className="charts-grid">
        {/* Weekly Velocity Bar Chart */}
        <div className="chart-card">
          <h4 className="chart-card-title">Weekly Task Velocity</h4>
          <p className="chart-card-sub">Completed vs Created tasks over past 7 days</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="created" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Created" />
                <Bar dataKey="completed" fill="#0f172a" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Donut Chart */}
        <div className="chart-card">
          <h4 className="chart-card-title">Task Distribution by Status</h4>
          <p className="chart-card-sub">Current distribution across all active projects</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
