import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { getPagination } from '../../utils/pagination';
import * as service from './activities.service';
import { ActivityType } from '../../types/models';

export const createActivityHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const session = service.createActivitySession(req.user!.id, req.body);
  res.status(201).json({ success: true, data: session });
});

export const listActivitiesHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pagination = getPagination(req);
  const type = req.query.type as ActivityType | undefined;
  const result = service.listActivitySessions(req.user!.id, pagination, type);
  res.json({ success: true, ...result });
});

export const getActivityHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const session = service.getActivitySession(req.user!.id, req.params.id);
  res.json({ success: true, data: session });
});

export const deleteActivityHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = service.deleteActivitySession(req.user!.id, req.params.id);
  res.json({ success: true, data: result });
});

export const getDailyActivityHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const date = (req.query.date as string) ?? new Date().toISOString().slice(0, 10);
  const result = service.getDailyActivity(req.user!.id, date);
  res.json({ success: true, data: result });
});

export const upsertDailyActivityHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const date = (req.body.date as string) ?? new Date().toISOString().slice(0, 10);
  const result = service.upsertManualDailyActivity(req.user!.id, date, req.body);
  res.json({ success: true, data: result });
});

export const listDailyActivitiesHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const days = Math.min(parseInt(String(req.query.days ?? '30'), 10) || 30, 90);
  const result = service.listDailyActivities(req.user!.id, days);
  res.json({ success: true, data: result });
});

export const weeklySummaryHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = service.getWeeklySummary(req.user!.id);
  res.json({ success: true, data: result });
});

export const monthlySummaryHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = service.getMonthlySummary(req.user!.id);
  res.json({ success: true, data: result });
});
