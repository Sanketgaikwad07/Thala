import { Router } from 'express';
import { authenticate, requireRole } from '../../middlewares/auth';
import * as controller from './admin.controller';

const router = Router();
router.use(authenticate, requireRole('admin'));

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Admin-only dashboard, user management, content CRUD, platform analytics and reports
 */

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Platform dashboard stats (users, sessions, distance, workouts, sports, posts, challenges)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard stats }
 */
router.get('/dashboard', controller.dashboardHandler);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List/search all users (paginated)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Users list }
 */
router.get('/users', controller.listUsersHandler);
router.get('/users/:id', controller.getUserHandler);
router.delete('/users/:id', controller.deleteUserHandler);

/**
 * @openapi
 * /admin/workouts:
 *   post:
 *     tags: [Admin]
 *     summary: Create a workout routine
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Workout created }
 */
router.post('/workouts', controller.createWorkoutHandler);
router.patch('/workouts/:id', controller.updateWorkoutHandler);
router.delete('/workouts/:id', controller.deleteWorkoutHandler);

/**
 * @openapi
 * /admin/sports:
 *   post:
 *     tags: [Admin]
 *     summary: Create a sport
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Sport created }
 */
router.post('/sports', controller.createSportHandler);
router.patch('/sports/:id', controller.updateSportHandler);
router.delete('/sports/:id', controller.deleteSportHandler);

/**
 * @openapi
 * /admin/diet-plans:
 *   get:
 *     tags: [Admin]
 *     summary: List all generated diet plans (paginated)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Diet plans }
 */
router.get('/diet-plans', controller.listDietPlansHandler);

/**
 * @openapi
 * /admin/achievements:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new achievement/badge definition
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Achievement created }
 */
router.post('/achievements', controller.createAchievementHandler);
router.delete('/achievements/:id', controller.deleteAchievementHandler);

/**
 * @openapi
 * /admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Platform-wide analytics (users by goal, sessions by activity type)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Platform analytics }
 */
router.get('/analytics', controller.platformAnalyticsHandler);

/**
 * @openapi
 * /admin/reports:
 *   get:
 *     tags: [Admin]
 *     summary: Admin reports overview (most active users, totals)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reports overview }
 */
router.get('/reports', controller.reportsOverviewHandler);

/**
 * @openapi
 * /admin/notifications/broadcast:
 *   post:
 *     tags: [Admin]
 *     summary: Broadcast a push notification to all users
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Broadcast sent }
 */
router.post('/notifications/broadcast', controller.broadcastNotificationHandler);

export default router;
