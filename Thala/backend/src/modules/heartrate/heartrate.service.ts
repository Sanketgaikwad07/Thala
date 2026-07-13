import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { HeartRateEntry } from '../../types/models';

export function addHeartRateEntry(userId: string, bpm: number, source: 'manual' | 'device') {
  const entry: HeartRateEntry = {
    id: uuid(),
    userId,
    bpm,
    source,
    recordedAt: new Date().toISOString(),
  };
  db.heartRateEntries.push(entry);
  return entry;
}

export function listHeartRate(userId: string, range: 'daily' | 'weekly' | 'monthly') {
  const days = range === 'daily' ? 1 : range === 'weekly' ? 7 : 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const entries = db.heartRateEntries
    .filter((e) => e.userId === userId && new Date(e.recordedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  const bpmValues = entries.map((e) => e.bpm);
  const avg = bpmValues.length ? Math.round(bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length) : 0;
  const max = bpmValues.length ? Math.max(...bpmValues) : 0;
  const min = bpmValues.length ? Math.min(...bpmValues) : 0;

  return { range, entries, stats: { avg, max, min, count: entries.length } };
}

export function latestHeartRate(userId: string) {
  const entries = db.heartRateEntries
    .filter((e) => e.userId === userId)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  return entries[0] ?? null;
}
