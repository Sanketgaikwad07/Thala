export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let category: BmiResult['category'] = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

export function calculateBmr(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female' | 'other';
}): number {
  const { weightKg, heightCm, age, gender } = params;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === 'male' ? base + 5 : gender === 'female' ? base - 161 : base - 78;
  return Math.round(bmr);
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function calculateDailyCalories(bmr: number, activityLevel: keyof typeof ACTIVITY_MULTIPLIERS = 'moderate'): number {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55));
}

export function calorieAdjustmentForGoal(
  dailyCalories: number,
  goal: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'fat_loss' | 'maintenance',
): number {
  switch (goal) {
    case 'weight_loss':
    case 'fat_loss':
      return Math.round(dailyCalories - 500);
    case 'weight_gain':
    case 'muscle_gain':
      return Math.round(dailyCalories + 400);
    default:
      return dailyCalories;
  }
}

export function estimateRunningCalories(distanceKm: number, weightKg: number): number {
  // MET-based estimate for running ~ MET 9.8
  return Math.round(distanceKm * weightKg * 1.036);
}

export function estimateCyclingCalories(distanceKm: number, weightKg: number): number {
  return Math.round(distanceKm * weightKg * 0.42);
}

export function estimateWalkingCalories(steps: number, weightKg: number): number {
  const distanceKm = steps * 0.0008; // approx stride
  return Math.round(distanceKm * weightKg * 0.53);
}

export function paceMinPerKm(distanceKm: number, durationSeconds: number): number {
  if (distanceKm <= 0) return 0;
  return Number((durationSeconds / 60 / distanceKm).toFixed(2));
}
