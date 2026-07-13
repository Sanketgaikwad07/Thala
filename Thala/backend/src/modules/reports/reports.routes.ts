import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as controller from './reports.controller';

const router = Router();

/**
 * @openapi
 * /reports:
 *   get:
 *     tags: [Reports]
 *     summary: Get a weekly or monthly personal report (?period=weekly|monthly)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Report }
 */
router.get('/', authenticate, controller.getReportHandler);

export default router;
