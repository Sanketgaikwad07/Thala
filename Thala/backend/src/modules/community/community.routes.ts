import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import * as controller from './community.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Community
 *   description: Workout/running posts feed - like, comment, share, follow
 */

/**
 * @openapi
 * /community/feed:
 *   get:
 *     tags: [Community]
 *     summary: Get the paginated community feed
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Feed }
 *   post:
 *     tags: [Community]
 *     summary: Create a new post
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Post created }
 */
router.get('/feed', authenticate, controller.getFeedHandler);
router.post('/feed', authenticate, [body('content').isString().notEmpty()], validate, controller.createPostHandler);

/**
 * @openapi
 * /community/posts/{id}/like:
 *   post:
 *     tags: [Community]
 *     summary: Toggle like on a post
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Like toggled }
 */
router.post('/posts/:id/like', authenticate, controller.toggleLikeHandler);

/**
 * @openapi
 * /community/posts/{id}/comments:
 *   post:
 *     tags: [Community]
 *     summary: Add a comment to a post
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Comment added }
 */
router.post('/posts/:id/comments', authenticate, [body('text').isString().notEmpty()], validate, controller.addCommentHandler);

/**
 * @openapi
 * /community/posts/{id}/share:
 *   post:
 *     tags: [Community]
 *     summary: Share a post (increments share count)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Post shared }
 */
router.post('/posts/:id/share', authenticate, controller.sharePostHandler);

/**
 * @openapi
 * /community/follow/{userId}:
 *   post:
 *     tags: [Community]
 *     summary: Toggle follow/unfollow on a user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Follow toggled }
 */
router.post('/follow/:userId', authenticate, controller.toggleFollowHandler);

/**
 * @openapi
 * /community/follow-stats/{userId}:
 *   get:
 *     tags: [Community]
 *     summary: Get follower/following counts for a user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Follow stats }
 */
router.get('/follow-stats/:userId', authenticate, controller.followStatsHandler);

export default router;
