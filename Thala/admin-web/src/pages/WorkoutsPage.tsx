import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createWorkout, deleteWorkout, listWorkoutsPublic } from '@/api/admin';

const CATEGORIES = ['chest', 'legs', 'back', 'arms', 'shoulder', 'core', 'cardio', 'yoga'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

export function WorkoutsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'workouts'], queryFn: () => listWorkoutsPublic(1) });

  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    level: LEVELS[0],
    durationMinutes: 30,
    caloriesBurned: 200,
    description: '',
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'workouts'] });
  const createMutation = useMutation({
    mutationFn: () => createWorkout(form),
    onSuccess: () => {
      invalidate();
      setForm({ name: '', category: CATEGORIES[0], level: LEVELS[0], durationMinutes: 30, caloriesBurned: 200, description: '' });
    },
  });
  const removeMutation = useMutation({ mutationFn: deleteWorkout, onSuccess: invalidate });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workouts</h1>
          <p className="page-subtitle">{data?.meta.total ?? 0} workout routines</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Add Workout</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}
        >
          <div className="form-row">
            <label>Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Level</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Duration (min)</label>
            <input
              type="number"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
            />
          </div>
          <div className="form-row">
            <label>Calories</label>
            <input
              type="number"
              value={form.caloriesBurned}
              onChange={(e) => setForm({ ...form, caloriesBurned: Number(e.target.value) })}
            />
          </div>
          <div className="form-row" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div>
            <button className="btn" type="submit" disabled={createMutation.isPending}>
              Add Workout
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
                <th>Category</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Calories</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{workout.category}</td>
                  <td style={{ textTransform: 'capitalize' }}>{workout.level}</td>
                  <td>{workout.durationMinutes} min</td>
                  <td>{workout.caloriesBurned} kcal</td>
                  <td>
                    <button className="btn danger" onClick={() => removeMutation.mutate(workout.id)}>
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
