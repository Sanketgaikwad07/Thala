import { body } from 'express-validator';

export const registerValidation = [
  body('name').isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isString(),
];

export const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const refreshValidation = [body('refreshToken').isString().notEmpty()];

export const otpRequestValidation = [
  body('destination').isString().notEmpty().withMessage('Email or phone is required'),
  body('purpose').isIn(['login', 'register', 'reset_password']),
];

export const otpVerifyValidation = [
  body('destination').isString().notEmpty(),
  body('code').isString().isLength({ min: 4, max: 8 }),
  body('purpose').isIn(['login', 'register', 'reset_password']),
];

export const googleAuthValidation = [body('idToken').isString().notEmpty()];

export const forgotPasswordValidation = [body('email').isEmail()];

export const resetPasswordValidation = [
  body('email').isEmail(),
  body('code').isString().notEmpty(),
  body('newPassword').isString().isLength({ min: 6 }),
];
