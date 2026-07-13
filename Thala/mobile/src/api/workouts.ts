import { apiClient, ApiEnvelope, PaginatedEnvelope } from './client';
import { Exercise, ExerciseCategory, ExperienceLevel, Workout } from '@/types/models';

export async function listExercises(category?: ExerciseCategory, level?: ExperienceLevel) {
  const { data } = await apiClient.get<ApiEnvelope<Exercise[]>>('/workouts/exercises', { params: { category, level } });
  return data.data;
}

export async function getExercise(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<Exercise>>(`/workouts/exercises/${id}`);
  return data.data;
}

export async function listWorkouts(level?: ExperienceLevel, category?: ExerciseCategory, page = 1) {
  const { data } = await apiClient.get<PaginatedEnvelope<Workout>>('/workouts', { params: { level, category, page, limit: 20 } });
  return data;
}

export async function getWorkout(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<Workout>>(`/workouts/${id}`);
  return data.data;
}
