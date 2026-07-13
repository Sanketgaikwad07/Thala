import { RoutePoint } from '@/types/models';

const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(a: RoutePoint, b: RoutePoint): number {
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export function totalRouteDistanceKm(route: RoutePoint[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i += 1) {
    total += haversineDistanceKm(route[i - 1], route[i]);
  }
  return total;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function paceMinPerKm(distanceKm: number, durationSeconds: number): number {
  if (distanceKm <= 0) return 0;
  return durationSeconds / 60 / distanceKm;
}

export function speedKmh(distanceKm: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return (distanceKm / durationSeconds) * 3600;
}

export function estimateCalories(type: 'running' | 'cycling' | 'walking', distanceKm: number, weightKg = 70): number {
  const factor = type === 'running' ? 1.036 : type === 'cycling' ? 0.42 : 0.53;
  return Math.round(distanceKm * weightKg * factor);
}

export function estimateElevationGain(route: RoutePoint[]): number {
  let gain = 0;
  for (let i = 1; i < route.length; i += 1) {
    const diff = (route[i].altitude ?? 0) - (route[i - 1].altitude ?? 0);
    if (diff > 0) gain += diff;
  }
  return Math.round(gain);
}
