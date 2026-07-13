import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { getPagination } from '../../utils/pagination';
import * as service from './history.service';

export const getHistoryHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pagination = getPagination(req);
  const result = service.getCombinedHistory(req.user!.id, pagination);
  res.json({ success: true, ...result });
});
