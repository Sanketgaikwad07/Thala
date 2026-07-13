import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './achievements.service';

export const listAchievementsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.listAchievements(req.user!.id) });
});

export const evaluateAchievementsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.evaluateAchievements(req.user!.id) });
});
