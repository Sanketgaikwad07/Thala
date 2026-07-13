import { useQuery } from '@tanstack/react-query';
import { getReportsOverview } from '@/api/admin';

export function ReportsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'reports'], queryFn: getReportsOverview });

  if (isLoading || !data) return <p>Loading reports...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">{data.totalReportsGenerated} reports generated to date</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Total Sessions</th>
            </tr>
          </thead>
          <tbody>
            {data.mostActiveUsers.map((user, idx) => (
              <tr key={user.id}>
                <td>#{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
