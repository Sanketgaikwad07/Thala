import { useQuery } from '@tanstack/react-query';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getDashboard } from '@/api/admin';

export function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: getDashboard });

  if (isLoading || !data) return <p>Loading dashboard...</p>;

  const stats = [
    { label: 'Total Users', value: data.totalUsers },
    { label: 'Activity Sessions', value: data.totalSessions },
    { label: 'Total Distance (km)', value: data.totalDistanceKm },
    { label: 'Workouts', value: data.totalWorkouts },
    { label: 'Sports', value: data.totalSports },
    { label: 'Community Posts', value: data.totalPosts },
    { label: 'Active Challenges', value: data.activeChallenges },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Platform overview and activity trends</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Active Users (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e9e8" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="activeUsers" stroke="#0f8a58" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
