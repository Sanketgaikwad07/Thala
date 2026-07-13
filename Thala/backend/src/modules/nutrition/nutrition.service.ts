import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { calculateBmi, calculateBmr, calculateDailyCalories, calorieAdjustmentForGoal } from '../../utils/calculations';
import { generateCoachRecommendations } from '../../utils/aiCoach';
import { DietPlan, FitnessGoal } from '../../types/models';

const MEAL_LIBRARY: Record<FitnessGoal, DietPlan['meals']> = {
  weight_loss: {
    breakfast: ['Vegetable oats with 1 boiled egg', 'Black coffee or green tea'],
    lunch: ['Grilled chicken/tofu salad', 'Steamed vegetables', 'Small portion brown rice'],
    dinner: ['Grilled fish or paneer', 'Sauteed greens', 'Lentil soup'],
    snacks: ['Cucumber & carrot sticks', 'Buttermilk', 'A handful of nuts'],
  },
  fat_loss: {
    breakfast: ['Protein smoothie with spinach and berries', 'Green tea'],
    lunch: ['Grilled chicken breast', 'Quinoa salad', 'Mixed greens'],
    dinner: ['Baked salmon or tofu', 'Roasted vegetables'],
    snacks: ['Greek yogurt', 'Almonds (10-12)', 'Herbal tea'],
  },
  weight_gain: {
    breakfast: ['Peanut butter banana toast', 'Full-fat milk', '2 boiled eggs'],
    lunch: ['Chicken/paneer rice bowl', 'Dal', 'Ghee roti'],
    dinner: ['Beef/paneer curry', 'Rice', 'Vegetable curry'],
    snacks: ['Dry fruit trail mix', 'Protein shake with milk', 'Cheese sandwich'],
  },
  muscle_gain: {
    breakfast: ['4-egg omelette with cheese', 'Whole grain toast', 'Whole milk'],
    lunch: ['Chicken breast (200g)', 'Sweet potato', 'Broccoli'],
    dinner: ['Lean beef/paneer', 'Brown rice', 'Mixed vegetables'],
    snacks: ['Whey protein shake', 'Peanut butter', 'Cottage cheese'],
  },
  maintenance: {
    breakfast: ['Oats with fruit', 'Boiled eggs'],
    lunch: ['Balanced thali - protein, grain, vegetable'],
    dinner: ['Soup and grilled protein with vegetables'],
    snacks: ['Fruit', 'Nuts', 'Yogurt'],
  },
};

export function calculateDietPlan(userId: string): DietPlan {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw ApiError.notFound('User not found');
  if (!user.weightKg || !user.heightCm || !user.age || !user.gender) {
    throw ApiError.badRequest('Complete your profile (weight, height, age, gender) to generate a diet plan');
  }

  const { bmi } = calculateBmi(user.weightKg, user.heightCm);
  const bmr = calculateBmr({ weightKg: user.weightKg, heightCm: user.heightCm, age: user.age, gender: user.gender });
  const maintenanceCalories = calculateDailyCalories(bmr, 'moderate');
  const goal = user.fitnessGoal ?? 'maintenance';
  const dailyCalories = calorieAdjustmentForGoal(maintenanceCalories, goal);

  const plan: DietPlan = {
    id: uuid(),
    userId,
    goal,
    bmi,
    bmr,
    dailyCalories,
    meals: MEAL_LIBRARY[goal],
    waterTargetMl: Math.round(user.weightKg * 35),
    createdAt: new Date().toISOString(),
  };

  const existingIdx = db.dietPlans.findIndex((p) => p.userId === userId);
  if (existingIdx >= 0) db.dietPlans[existingIdx] = plan;
  else db.dietPlans.push(plan);

  return plan;
}

export function getDietPlan(userId: string): DietPlan {
  const plan = db.dietPlans.find((p) => p.userId === userId);
  if (!plan) return calculateDietPlan(userId);
  return plan;
}

export function getAiCoachRecommendations(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const todayActivity = db.dailyActivities.find((d) => d.userId === userId && d.date === today);
  const recentHeartRate = db.heartRateEntries.filter((h) => h.userId === userId).slice(-10);
  const plan = getDietPlan(userId);
  const distanceKmToday = db.activitySessions
    .filter((s) => s.userId === userId && s.startedAt.slice(0, 10) === today)
    .reduce((sum, s) => sum + s.distanceKm, 0);

  return generateCoachRecommendations({
    todayActivity,
    recentHeartRate,
    dailyCalorieTarget: plan.dailyCalories,
    distanceKmToday,
    waterGoalMl: plan.waterTargetMl,
  });
}
