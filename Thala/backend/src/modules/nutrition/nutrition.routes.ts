import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as controller from './nutrition.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Nutrition
 *   description: BMI/BMR/daily calorie calculation, diet planner and AI fitness coach recommendations
 */

/**
 * @openapi
 * /nutrition/diet-plan:
 *   get:
 *     tags: [Nutrition]
 *     summary: Get (or lazily generate) the user's current diet plan
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Diet plan }
 *   post:
 *     tags: [Nutrition]
 *     summary: Recalculate and regenerate the diet plan from the latest profile data
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Diet plan regenerated }
 */
router.get('/diet-plan', authenticate, controller.getDietPlanHandler);
router.post('/diet-plan', authenticate, controller.regenerateDietPlanHandler);

/**
 * @openapi
 * /nutrition/ai-coach:
 *   get:
 *     tags: [Nutrition]
 *     summary: Get AI fitness coach recommendations derived from recent activity, sleep, water and heart rate
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Coach recommendations }
 */
router.get('/ai-coach', authenticate, controller.getAiCoachHandler);

export default router;
