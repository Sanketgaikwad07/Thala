import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as controller from './achievements.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Achievements
 *   description: Badges - First Run, 10 KM, 100 KM, 30 Days Streak, 10000 Steps, Marathon
 */

/**
 * @openapi
 * /achievements:
 *   get:
 *     tags: [Achievements]
 *     summary: List all badges with unlock status for the authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Achievements list }
 */
router.get('/', authenticate, controller.listAchievementsHandler);

/**
 * @openapi
 * /achievements/evaluate:
 *   post:
 *     tags: [Achievements]
 *     summary: Re-evaluate the user's stats and unlock any newly earned badges
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Evaluation result }
 */
router.post('/evaluate', authenticate, controller.evaluateAchievementsHandler);

export default router;
