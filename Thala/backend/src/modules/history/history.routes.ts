import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as controller from './history.controller';

const router = Router();

/**
 * @openapi
 * /history:
 *   get:
 *     tags: [History]
 *     summary: Combined, paginated history of activity sessions and heart rate readings
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: History feed }
 */
router.get('/', authenticate, controller.getHistoryHandler);

export default router;
