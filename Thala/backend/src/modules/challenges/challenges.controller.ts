import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import * as service from './challenges.service';
import { ChallengeFrequency } from '../../types/models';

export const listChallengesHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const frequency = req.query.frequency as ChallengeFrequency | undefined;
  res.json({ success: true, data: service.listChallenges(req.user!.id, frequency) });
});

export const joinChallengeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.status(201).json({ success: true, data: service.joinChallenge(req.user!.id, req.params.id) });
});

export const updateProgressHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.updateProgress(req.user!.id, req.params.id, req.body.progress) });
});

export const leaderboardHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: service.getLeaderboard(req.params.id) });
});
