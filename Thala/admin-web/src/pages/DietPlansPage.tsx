import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listDietPlans } from '@/api/admin';

export function DietPlansPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'diet-plans', page], queryFn: () => listDietPlans(page) });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Diet Plans</h1>
          <p className="page-subtitle">{data?.meta.total ?? 0} generated diet plans</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <p style={{ padding: 20 }}>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Goal</th>
                <th>BMI</th>
                <th>Daily Calories</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.userId.slice(0, 8)}...</td>
                  <td style={{ textTransform: 'capitalize' }}>{plan.goal.replace('_', ' ')}</td>
                  <td>{plan.bmi}</td>
                  <td>{plan.dailyCalories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.meta.totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <button className="btn secondary" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
