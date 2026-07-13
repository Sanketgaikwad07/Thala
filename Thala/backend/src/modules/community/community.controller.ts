import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { getPagination } from '../../utils/pagination';
import * as service from './community.service';

export const getFeedHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = service.getFeed(req.user!.id, getPagination(req));
  res.json({ success: true, ...result });
});

export const createPostHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { content, imageUrl, activitySessionId } = req.body;
  res.status(201).json({ success: true, data: service.createPost(req.user!.id, content, imageUrl, activitySessionId) });
});

export const toggleLikeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.toggleLike(req.user!.id, req.params.id) });
});

export const addCommentHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.status(201).json({ success: true, data: service.addComment(req.user!.id, req.params.id, req.body.text) });
});

export const sharePostHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.sharePost(req.user!.id, req.params.id) });
});

export const toggleFollowHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.toggleFollow(req.user!.id, req.params.userId) });
});

export const followStatsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getFollowStats(req.params.userId ?? req.user!.id) });
});
