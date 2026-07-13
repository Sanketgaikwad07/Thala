import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getPagination } from '../../utils/pagination';
import * as service from './admin.service';

export const dashboardHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.getDashboardStats() });
});

export const listUsersHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = service.listUsers(getPagination(req), req.query.search as string | undefined);
  res.json({ success: true, ...result });
});

export const getUserHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.getUser(req.params.id) });
});

export const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.deleteUser(req.params.id) });
});

export const createWorkoutHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: service.createWorkout(req.body) });
});

export const updateWorkoutHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.updateWorkout(req.params.id, req.body) });
});

export const deleteWorkoutHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.deleteWorkout(req.params.id) });
});

export const createSportHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: service.createSport(req.body) });
});

export const updateSportHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.updateSport(req.params.id, req.body) });
});

export const deleteSportHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.deleteSport(req.params.id) });
});

export const listDietPlansHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, ...service.listDietPlans(getPagination(req)) });
});

export const createAchievementHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: service.createAchievement(req.body) });
});

export const deleteAchievementHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.deleteAchievement(req.params.id) });
});

export const platformAnalyticsHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.platformAnalytics() });
});

export const reportsOverviewHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.listReportsOverview() });
});

export const broadcastNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
  const { title, body } = req.body;
  res.status(201).json({ success: true, data: await service.broadcastNotification(title, body) });
});
