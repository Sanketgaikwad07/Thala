import { body } from 'express-validator';

export const createActivityValidation = [
  body('type').isIn(['running', 'cycling', 'walking']),
  body('startedAt').isISO8601(),
  body('endedAt').isISO8601(),
  body('durationSeconds').isInt({ min: 1 }),
  body('distanceKm').isFloat({ min: 0 }),
  body('calories').isFloat({ min: 0 }),
  body('route').isArray(),
];

export const dailyActivityValidation = [
  body('steps').optional().isInt({ min: 0 }),
  body('waterMl').optional().isInt({ min: 0 }),
  body('sleepHours').optional().isFloat({ min: 0, max: 24 }),
];
