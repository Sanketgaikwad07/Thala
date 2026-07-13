import { DailyActivity, HeartRateEntry } from '../types/models';

export interface CoachRecommendation {
  id: string;
  icon: string;
  message: string;
  category: 'activity' | 'nutrition' | 'sleep' | 'hydration' | 'recovery' | 'performance';
}

/**
 * Rule-based "AI" coach: derives human-readable recommendations from the
 * user's recent mock activity data. Deterministic and dependency-free so it
 * runs the same in demo mode as it would with a real ML/LLM backend later.
 */
export function generateCoachRecommendations(params: {
  todayActivity?: DailyActivity;
  recentHeartRate: HeartRateEntry[];
  dailyCalorieTarget: number;
  distanceKmToday: number;
  sleepGoalHours?: number;
  waterGoalMl?: number;
}): CoachRecommendation[] {
  const { todayActivity, recentHeartRate, dailyCalorieTarget, distanceKmToday, sleepGoalHours = 8, waterGoalMl = 3000 } = params;
  const recs: CoachRecommendation[] = [];

  if (distanceKmToday > 0) {
    recs.push({
      id: 'distance',
      icon: 'run-fast',
      category: 'performance',
      message: `You covered ${distanceKmToday.toFixed(1)} km today. Try increasing your pace by 5-10% on your next run to build speed.`,
    });
  }

  if (todayActivity) {
    if (todayActivity.waterMl < waterGoalMl) {
      const remaining = ((waterGoalMl - todayActivity.waterMl) / 1000).toFixed(1);
      recs.push({
        id: 'hydration',
        icon: 'cup-water',
        category: 'hydration',
        message: `Drink ${remaining}L more water today to hit your ${(waterGoalMl / 1000).toFixed(1)}L goal.`,
      });
    }

    if (todayActivity.sleepHours < sleepGoalHours) {
      recs.push({
        id: 'sleep',
        icon: 'sleep',
        category: 'sleep',
        message: `You slept ${todayActivity.sleepHours}h last night. Aim for at least ${sleepGoalHours}h to support recovery.`,
      });
    }

    recs.push({
      id: 'calories',
      icon: 'food-apple',
      category: 'nutrition',
      message: `You should consume around ${dailyCalorieTarget} kcal today based on your goal and activity level.`,
    });

    const sleepPenalty = (sleepGoalHours - todayActivity.sleepHours) * 6;
    const stepsPenalty = Math.max(0, 8000 - todayActivity.steps) / 400;
    const recoveryScore = Math.max(40, Math.min(98, Math.round(100 - sleepPenalty - stepsPenalty)));
    recs.push({
      id: 'recovery',
      icon: 'heart-pulse',
      category: 'recovery',
      message: `Today's recovery score is ${recoveryScore}%. ${recoveryScore > 80 ? 'You are ready for an intense session.' : 'Consider a lighter, active-recovery workout.'}`,
    });
  }

  if (recentHeartRate.length > 0) {
    const avg = Math.round(recentHeartRate.reduce((sum, e) => sum + e.bpm, 0) / recentHeartRate.length);
    recs.push({
      id: 'heart-rate',
      icon: 'heart',
      category: 'performance',
      message: `Your average heart rate recently is ${avg} bpm, which is within a healthy resting range for your activity level.`,
    });
  }

  return recs;
}
