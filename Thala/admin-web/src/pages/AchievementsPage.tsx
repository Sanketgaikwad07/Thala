import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAchievement, deleteAchievement, listAchievementsPublic } from '@/api/admin';

export function AchievementsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'achievements'], queryFn: listAchievementsPublic });

  const [form, setForm] = useState({ code: '', title: '', description: '', icon: 'medal-outline', criteria: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'achievements'] });
  const createMutation = useMutation({
    mutationFn: () => createAchievement(form),
    onSuccess: () => {
      invalidate();
      setForm({ code: '', title: '', description: '', icon: 'medal-outline', criteria: '' });
    },
  });
  const removeMutation = useMutation({ mutationFn: deleteAchievement, onSuccess: invalidate });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Achievements</h1>
          <p className="page-subtitle">{data?.length ?? 0} badge definitions</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Add Achievement</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}
        >
          <div className="form-row">
            <label>Code</label>
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Criteria</label>
            <input value={form.criteria} onChange={(e) => setForm({ ...form, criteria: e.target.value })} />
          </div>
          <div className="form-row" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div>
            <button className="btn" type="submit" disabled={createMutation.isPending}>
              Add Achievement
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
                <th>Title</th>
                <th>Code</th>
                <th>Criteria</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((achievement) => (
                <tr key={achievement.id}>
                  <td>{achievement.title}</td>
                  <td>{achievement.code}</td>
                  <td>{achievement.criteria}</td>
                  <td>
                    <button className="btn danger" onClick={() => removeMutation.mutate(achievement.id)}>
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
