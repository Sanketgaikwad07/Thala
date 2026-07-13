import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import * as controller from './challenges.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Challenges
 *   description: Daily/weekly/monthly challenges and leaderboards
 */

/**
 * @openapi
 * /challenges:
 *   get:
 *     tags: [Challenges]
 *     summary: List challenges (optional ?frequency=daily|weekly|monthly) with the user's progress
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Challenges list }
 */
router.get('/', authenticate, controller.listChallengesHandler);

/**
 * @openapi
 * /challenges/{id}/join:
 *   post:
 *     tags: [Challenges]
 *     summary: Join a challenge
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Joined }
 */
router.post('/:id/join', authenticate, controller.joinChallengeHandler);

/**
 * @openapi
 * /challenges/{id}/progress:
 *   patch:
 *     tags: [Challenges]
 *     summary: Update the user's progress on a challenge
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Progress updated }
 */
router.patch('/:id/progress', authenticate, [body('progress').isFloat({ min: 0 })], validate, controller.updateProgressHandler);

/**
 * @openapi
 * /challenges/{id}/leaderboard:
 *   get:
 *     tags: [Challenges]
 *     summary: Get the leaderboard for a challenge
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Leaderboard }
 */
router.get('/:id/leaderboard', authenticate, controller.leaderboardHandler);

export default router;
