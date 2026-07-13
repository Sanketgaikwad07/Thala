import { apiClient, ApiEnvelope } from './client';
import { CoachRecommendation, DietPlan } from '@/types/models';

export async function getDietPlan() {
  const { data } = await apiClient.get<ApiEnvelope<DietPlan>>('/nutrition/diet-plan');
  return data.data;
}

export async function regenerateDietPlan() {
  const { data } = await apiClient.post<ApiEnvelope<DietPlan>>('/nutrition/diet-plan');
  return data.data;
}

export async function getAiCoachRecommendations() {
  const { data } = await apiClient.get<ApiEnvelope<CoachRecommendation[]>>('/nutrition/ai-coach');
  return data.data;
}
