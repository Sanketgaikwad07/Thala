import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { Exercise, Workout } from '../../types/models';
import { PaginationParams, paginate } from '../../utils/pagination';

export function listExercises(category?: Exercise['category'], level?: Exercise['level']) {
  return db.exercises.filter((e) => (!category || e.category === category) && (!level || e.level === level));
}

export function getExercise(id: string): Exercise {
  const exercise = db.exercises.find((e) => e.id === id);
  if (!exercise) throw ApiError.notFound('Exercise not found');
  return exercise;
}

export function listWorkouts(pagination: PaginationParams, level?: Workout['level'], category?: Workout['category']) {
  const items = db.workouts.filter((w) => (!level || w.level === level) && (!category || w.category === category));
  return paginate(items, pagination);
}

export function getWorkout(id: string) {
  const workout = db.workouts.find((w) => w.id === id);
  if (!workout) throw ApiError.notFound('Workout not found');
  const exercises = db.exercises.filter((e) => workout.exerciseIds.includes(e.id));
  return { ...workout, exercises };
}
