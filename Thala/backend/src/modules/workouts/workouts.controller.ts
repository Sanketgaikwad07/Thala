import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getPagination } from '../../utils/pagination';
import * as service from './workouts.service';
import { Exercise, Workout } from '../../types/models';

export const listExercisesHandler = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category as Exercise['category'] | undefined;
  const level = req.query.level as Exercise['level'] | undefined;
  const result = service.listExercises(category, level);
  res.json({ success: true, data: result });
});

export const getExerciseHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = service.getExercise(req.params.id);
  res.json({ success: true, data: result });
});

export const listWorkoutsHandler = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const level = req.query.level as Workout['level'] | undefined;
  const category = req.query.category as Workout['category'] | undefined;
  const result = service.listWorkouts(pagination, level, category);
  res.json({ success: true, ...result });
});

export const getWorkoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = service.getWorkout(req.params.id);
  res.json({ success: true, data: result });
});
