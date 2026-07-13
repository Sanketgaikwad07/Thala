import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';

export function listSports() {
  return db.sports;
}

export function getSport(id: string) {
  const sport = db.sports.find((s) => s.id === id);
  if (!sport) throw ApiError.notFound('Sport not found');
  return sport;
}
