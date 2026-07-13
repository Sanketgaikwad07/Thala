import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './analytics.service';

function rangeOf(req: AuthenticatedRequest) {
  return (req.query.range as 'daily' | 'weekly' | 'monthly') ?? 'weekly';
}

export const overviewHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getAnalyticsOverview(req.user!.id, rangeOf(req)) });
});

export const runningHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getRunningAnalytics(req.user!.id, rangeOf(req)) });
});

export const caloriesHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getCaloriesAnalytics(req.user!.id, rangeOf(req)) });
});

export const heartRateHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getHeartRateAnalytics(req.user!.id, rangeOf(req)) });
});

export const weightHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getWeightAnalytics(req.user!.id) });
});

export const bmiHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getBmiAnalytics(req.user!.id) });
});

export const distanceHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getDistanceAnalytics(req.user!.id, rangeOf(req)) });
});

export const workoutTimeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getWorkoutTimeAnalytics(req.user!.id, rangeOf(req)) });
});
