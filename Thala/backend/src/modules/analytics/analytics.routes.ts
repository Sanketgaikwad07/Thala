import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as controller from './analytics.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Analytics
 *   description: Progress analytics charts - running, calories, heart rate, weight, BMI, distance, workout time
 */

/**
 * @openapi
 * /analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: All analytics series combined (?range=daily|weekly|monthly)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Analytics overview }
 */
router.get('/overview', authenticate, controller.overviewHandler);
router.get('/running', authenticate, controller.runningHandler);
router.get('/calories', authenticate, controller.caloriesHandler);
router.get('/heart-rate', authenticate, controller.heartRateHandler);
router.get('/weight', authenticate, controller.weightHandler);
router.get('/bmi', authenticate, controller.bmiHandler);
router.get('/distance', authenticate, controller.distanceHandler);
router.get('/workout-time', authenticate, controller.workoutTimeHandler);

export default router;
