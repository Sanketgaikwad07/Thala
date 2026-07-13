import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getPlatformAnalytics } from '@/api/admin';

const COLORS = ['#0f8a58', '#ff6b00', '#3b82f6', '#8b5cf6', '#f59e0b'];

export function AnalyticsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'analytics'], queryFn: getPlatformAnalytics });

  if (isLoading || !data) return <p>Loading analytics...</p>;

  const goalData = Object.entries(data.usersByGoal).map(([goal, count]) => ({ goal: goal.replace('_', ' '), count }));
  const sessionData = Object.entries(data.sessionsByType).map(([type, count]) => ({ name: type, value: count }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Analytics</h1>
          <p className="page-subtitle">Aggregate insights across all users</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Users by Fitness Goal</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={goalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e9e8" />
              <XAxis dataKey="goal" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f8a58" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Sessions by Activity Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sessionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {sessionData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
