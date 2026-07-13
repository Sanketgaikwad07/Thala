import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSport, deleteSport, listSportsPublic } from '@/api/admin';

export function SportsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'sports'], queryFn: listSportsPublic });

  const [form, setForm] = useState({ name: '', caloriesBurnedPerHour: 400, tips: '', injuryPrevention: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'sports'] });
  const createMutation = useMutation({
    mutationFn: () =>
      createSport({
        name: form.name,
        icon: 'trophy-outline',
        imageUrl: 'https://media.thala.app/sports/custom.jpg',
        caloriesBurnedPerHour: form.caloriesBurnedPerHour,
        tips: form.tips.split(',').map((t) => t.trim()).filter(Boolean),
        injuryPrevention: form.injuryPrevention.split(',').map((t) => t.trim()).filter(Boolean),
        trainingPlans: [],
      }),
    onSuccess: () => {
      invalidate();
      setForm({ name: '', caloriesBurnedPerHour: 400, tips: '', injuryPrevention: '' });
    },
  });
  const removeMutation = useMutation({ mutationFn: deleteSport, onSuccess: invalidate });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sports</h1>
          <p className="page-subtitle">{data?.length ?? 0} sports available in the app</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Add Sport</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}
        >
          <div className="form-row">
            <label>Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Calories/hour</label>
            <input
              type="number"
              value={form.caloriesBurnedPerHour}
              onChange={(e) => setForm({ ...form, caloriesBurnedPerHour: Number(e.target.value) })}
            />
          </div>
          <div className="form-row">
            <label>Tips (comma separated)</label>
            <input value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Injury Prevention (comma separated)</label>
            <input value={form.injuryPrevention} onChange={(e) => setForm({ ...form, injuryPrevention: e.target.value })} />
          </div>
          <div>
            <button className="btn" type="submit" disabled={createMutation.isPending}>
              Add Sport
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <p style={{ padding: 20 }}>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Calories/hr</th>
                <th>Tips</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((sport) => (
                <tr key={sport.id}>
                  <td>{sport.name}</td>
                  <td>{sport.caloriesBurnedPerHour}</td>
                  <td>{sport.tips.slice(0, 2).join('; ')}</td>
                  <td>
                    <button className="btn danger" onClick={() => removeMutation.mutate(sport.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
