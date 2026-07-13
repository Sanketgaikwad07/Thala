import { Router } from 'express';
import * as controller from './sports.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Sports
 *   description: Running, Cricket, Football, Basketball, Volleyball, Cycling, Gym, Swimming, Tennis, Badminton
 */

/**
 * @openapi
 * /sports:
 *   get:
 *     tags: [Sports]
 *     summary: List all sports with training plans, calories burned and tips
 *     responses:
 *       200: { description: Sports list }
 */
router.get('/', controller.listSportsHandler);

/**
 * @openapi
 * /sports/{id}:
 *   get:
 *     tags: [Sports]
 *     summary: Get a single sport's detail (training plans, tips, injury prevention)
 *     responses:
 *       200: { description: Sport detail }
 */
router.get('/:id', controller.getSportHandler);

export default router;
