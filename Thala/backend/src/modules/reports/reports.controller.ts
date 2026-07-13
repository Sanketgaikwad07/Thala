import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './reports.service';

export const getReportHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const period = (req.query.period as 'weekly' | 'monthly') ?? 'weekly';
  res.json({ success: true, data: service.getUserReport(req.user!.id, period) });
});
