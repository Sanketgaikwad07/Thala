import { Router } from 'express';
import * as controller from './workouts.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Workouts
 *   description: Exercises (chest, legs, back, arms, shoulder, core, cardio, yoga) grouped into beginner/intermediate/advanced workouts
 */

/**
 * @openapi
 * /workouts/exercises:
 *   get:
 *     tags: [Workouts]
 *     summary: List exercises, optionally filtered by ?category= and ?level=
 *     responses:
 *       200: { description: Exercises list }
 */
router.get('/exercises', controller.listExercisesHandler);

/**
 * @openapi
 * /workouts/exercises/{id}:
 *   get:
 *     tags: [Workouts]
 *     summary: Get a single exercise (GIF/image, description, sets, reps, rest, calories)
 *     responses:
 *       200: { description: Exercise detail }
 */
router.get('/exercises/:id', controller.getExerciseHandler);

/**
 * @openapi
 * /workouts:
 *   get:
 *     tags: [Workouts]
 *     summary: List workout routines, optionally filtered by ?level= and ?category=
 *     responses:
 *       200: { description: Workouts list }
 */
router.get('/', controller.listWorkoutsHandler);

/**
 * @openapi
 * /workouts/{id}:
 *   get:
 *     tags: [Workouts]
 *     summary: Get workout detail with its full exercise list
 *     responses:
 *       200: { description: Workout detail }
 */
router.get('/:id', controller.getWorkoutHandler);

export default router;
