import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './notifications.service';

export const listNotificationsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.listNotifications(req.user!.id) });
});

export const markAsReadHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.markAsRead(req.user!.id, req.params.id) });
});

export const markAllAsReadHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.markAllAsRead(req.user!.id) });
});

export const sendTestNotificationHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, body, type } = req.body;
  const result = await service.createAndSend(req.user!.id, title, body, type ?? 'system');
  res.status(201).json({ success: true, data: result });
});
