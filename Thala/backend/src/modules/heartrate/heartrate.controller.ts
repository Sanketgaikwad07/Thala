import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './heartrate.service';

export const addHeartRateHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { bpm, source } = req.body;
  const entry = service.addHeartRateEntry(req.user!.id, bpm, source ?? 'manual');
  res.status(201).json({ success: true, data: entry });
});

export const listHeartRateHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const range = (req.query.range as 'daily' | 'weekly' | 'monthly') ?? 'daily';
  const result = service.listHeartRate(req.user!.id, range);
  res.json({ success: true, data: result });
});

export const latestHeartRateHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = service.latestHeartRate(req.user!.id);
  res.json({ success: true, data: result });
});
