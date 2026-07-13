import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { ChallengeFrequency } from '../../types/models';

export function listChallenges(userId: string, frequency?: ChallengeFrequency) {
  return db.challenges
    .filter((c) => !frequency || c.frequency === frequency)
    .map((c) => {
      const participant = db.challengeParticipants.find((p) => p.challengeId === c.id && p.userId === userId);
      return { ...c, myProgress: participant?.progress ?? 0, joined: !!participant, completed: participant?.completed ?? false };
    });
}

export function joinChallenge(userId: string, challengeId: string) {
  const challenge = db.challenges.find((c) => c.id === challengeId);
  if (!challenge) throw ApiError.notFound('Challenge not found');
  const existing = db.challengeParticipants.find((p) => p.challengeId === challengeId && p.userId === userId);
  if (existing) return existing;
  const participant = { id: uuid(), challengeId, userId, progress: 0, completed: false };
  db.challengeParticipants.push(participant);
  return participant;
}

export function updateProgress(userId: string, challengeId: string, progress: number) {
  const challenge = db.challenges.find((c) => c.id === challengeId);
  if (!challenge) throw ApiError.notFound('Challenge not found');
  let participant = db.challengeParticipants.find((p) => p.challengeId === challengeId && p.userId === userId);
  if (!participant) participant = joinChallenge(userId, challengeId) as typeof participant & { progress: number; completed: boolean };
  participant!.progress = progress;
  participant!.completed = progress >= challenge.targetValue;
  return participant;
}

export function getLeaderboard(challengeId: string) {
  const challenge = db.challenges.find((c) => c.id === challengeId);
  if (!challenge) throw ApiError.notFound('Challenge not found');
  const participants = db.challengeParticipants
    .filter((p) => p.challengeId === challengeId)
    .sort((a, b) => b.progress - a.progress)
    .map((p, index) => {
      const user = db.users.find((u) => u.id === p.userId);
      return {
        rank: index + 1,
        userId: p.userId,
        name: user?.name ?? 'Unknown',
        photoUrl: user?.photoUrl,
        progress: p.progress,
        completed: p.completed,
      };
    });
  return { challenge, leaderboard: participants };
}
