import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import * as controller from './heartrate.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: HeartRate
 *   description: Manual heart rate entries and smartwatch sync data with daily/weekly/monthly graphs
 */

/**
 * @openapi
 * /heart-rate:
 *   post:
 *     tags: [HeartRate]
 *     summary: Log a heart rate reading (manual entry or synced from a device)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Reading saved }
 *   get:
 *     tags: [HeartRate]
 *     summary: Get heart rate history + stats for a range (?range=daily|weekly|monthly)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Heart rate data }
 */
router.post(
  '/',
  authenticate,
  [body('bpm').isInt({ min: 30, max: 240 }), body('source').optional().isIn(['manual', 'device'])],
  validate,
  controller.addHeartRateHandler,
);
router.get('/', authenticate, controller.listHeartRateHandler);

/**
 * @openapi
 * /heart-rate/latest:
 *   get:
 *     tags: [HeartRate]
 *     summary: Get the most recent heart rate reading
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Latest reading }
 */
router.get('/latest', authenticate, controller.latestHeartRateHandler);

export default router;
