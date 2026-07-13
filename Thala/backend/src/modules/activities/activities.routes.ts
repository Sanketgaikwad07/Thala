import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import * as controller from './activities.controller';
import * as v from './activities.validation';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Activities
 *   description: Running, cycling and walking session tracking + daily activity aggregation
 */

/**
 * @openapi
 * /activities:
 *   post:
 *     tags: [Activities]
 *     summary: Save a completed running/cycling/walking session (with GPS route)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Session saved }
 *   get:
 *     tags: [Activities]
 *     summary: List the authenticated user's activity sessions (paginated, optional ?type=)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Sessions list }
 */
router.post('/', authenticate, v.createActivityValidation, validate, controller.createActivityHandler);
router.get('/', authenticate, controller.listActivitiesHandler);

/**
 * FIX: All specific sub-routes MUST be registered BEFORE the parameterized /:id route.
 * Express matches routes in the order they are defined, so /daily/today would be
 * captured as /:id with id="daily" if /:id comes first.
 */

/**
 * @openapi
 * /activities/daily/today:
 *   get:
 *     tags: [Activities]
 *     summary: Get daily activity for a given date (defaults today) - steps, calories, water, sleep
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Daily activity }
 *   patch:
 *     tags: [Activities]
 *     summary: Manually log steps/water/sleep for a date
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated }
 */
router.get('/daily/today', authenticate, controller.getDailyActivityHandler);
router.patch('/daily/today', authenticate, v.dailyActivityValidation, validate, controller.upsertDailyActivityHandler);

/**
 * @openapi
 * /activities/daily/history:
 *   get:
 *     tags: [Activities]
 *     summary: List recent daily activity records (?days=30)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Daily activity history }
 */
router.get('/daily/history', authenticate, controller.listDailyActivitiesHandler);

/**
 * @openapi
 * /activities/summary/weekly:
 *   get:
 *     tags: [Activities]
 *     summary: Weekly summary (totals + averages)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Weekly summary }
 */
router.get('/summary/weekly', authenticate, controller.weeklySummaryHandler);

/**
 * @openapi
 * /activities/summary/monthly:
 *   get:
 *     tags: [Activities]
 *     summary: Monthly summary (totals + averages)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Monthly summary }
 */
router.get('/summary/monthly', authenticate, controller.monthlySummaryHandler);

/**
 * @openapi
 * /activities/{id}:
 *   get:
 *     tags: [Activities]
 *     summary: Get one activity session by id (includes full GPS route for map replay)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Session detail }
 *   delete:
 *     tags: [Activities]
 *     summary: Delete an activity session
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Deleted }
 */
router.get('/:id', authenticate, controller.getActivityHandler);
router.delete('/:id', authenticate, controller.deleteActivityHandler);

export default router;
