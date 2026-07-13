import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './nutrition.service';

export const getDietPlanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getDietPlan(req.user!.id) });
});

export const regenerateDietPlanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.calculateDietPlan(req.user!.id) });
});

export const getAiCoachHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getAiCoachRecommendations(req.user!.id) });
});
