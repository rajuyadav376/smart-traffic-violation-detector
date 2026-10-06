import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

export default function AnalyticsView({ stats }) {
  const categoryData = [
    { name: 'Red Light', count: stats?.red_light || 142, color: '#ef4444' },
    { name: 'No Helmet', count: stats?.no_helmet || 118, color: '#f59e0b' },
    { name: 'Wrong Side', count: stats?.wrong_side || 41, color: '#a855f7' },
    { name: 'Triple Ride', count: stats?.triple_riding || 28, color: '#6366f1' },
    { name: 'Speeding', count: stats?.speeding || 26, color: '#10b981' },
    { name: 'Mobile Use', count: stats?.mobile_use || 15, color: '#06b6d4' }
  ];

  const hourlyTrend = [
    { hour: '08:00', violations: 18, vehicles: 640 },
    { hour: '10:00', violations: 45, vehicles: 1280 },
    { hour: '12:00', violations: 32, vehicles: 980 },
    { hour: '14:00', violations: 28, vehicles: 850 },
    { hour: '16:00', violations: 52, vehicles: 1420 },
    { hour: '18:00', violations: 74, vehicles: 1890 },
    { hour: '20:00', violations: 61, vehicles: 1650 },
    { hour: '22:00', violations: 29, vehicles: 710 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Category Distribution */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            VIOLATION TYPE DISTRIBUTION
          </h3>
          <span className="text-[10px] text-slate-400 font-mono-code">AI CLASSIFICATION</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Hourly Enforcement Intensity */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            HOURLY TRAFFIC & VIOLATION DENSITY
          </h3>
          <span className="text-[10px] text-slate-400 font-mono-code">PEAK ANALYSIS</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="violations" fill="#00f0ff" radius={[4, 4, 0, 0]} name="Violations Flagged" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
