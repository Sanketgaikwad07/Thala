import { db } from '../../data/db';
import { PaginationParams, paginate } from '../../utils/pagination';

export function getCombinedHistory(userId: string, pagination: PaginationParams) {
  const activityEvents = db.activitySessions
    .filter((s) => s.userId === userId)
    .map((s) => ({
      id: s.id,
      kind: 'activity' as const,
      type: s.type,
      date: s.startedAt,
      distanceKm: s.distanceKm,
      calories: s.calories,
      durationSeconds: s.durationSeconds,
    }));

  const heartRateEvents = db.heartRateEntries
    .filter((h) => h.userId === userId)
    .map((h) => ({ id: h.id, kind: 'heart_rate' as const, type: 'heart_rate', date: h.recordedAt, bpm: h.bpm }));

  const combined = [...activityEvents, ...heartRateEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return paginate(combined, pagination);
}
