import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as controller from './notifications.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Notifications
 *   description: In-app notifications and Firebase Cloud Messaging push delivery
 */

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List the user's notifications
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Notifications list }
 *   post:
 *     tags: [Notifications]
 *     summary: Create and push a notification (used for reminders/testing)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Notification sent }
 */
router.get('/', authenticate, controller.listNotificationsHandler);
router.post('/', authenticate, controller.sendTestNotificationHandler);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Marked read }
 */
/**
 * @openapi
 * /notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: All marked read }
 */
// FIX: /read-all MUST be registered before /:id/read to avoid Express matching
// "read-all" as the :id parameter with path "/read-all/read" never resolving correctly.
router.patch('/read-all', authenticate, controller.markAllAsReadHandler);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Marked read }
 */
router.patch('/:id/read', authenticate, controller.markAsReadHandler);

export default router;
