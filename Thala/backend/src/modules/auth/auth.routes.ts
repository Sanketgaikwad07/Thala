import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import * as controller from './auth.controller';
import * as v from './auth.validation';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Registration, login, OTP, Google sign-in and JWT refresh
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register with email & password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201: { description: Account created }
 */
router.post('/register', v.registerValidation, validate, controller.registerHandler);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email & password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Authenticated }
 */
router.post('/login', v.loginValidation, validate, controller.loginHandler);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange a refresh token for a new access/refresh token pair
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: New tokens issued }
 */
router.post('/refresh', v.refreshValidation, validate, controller.refreshHandler);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoke the current user's refresh tokens
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Logged out }
 */
router.post('/logout', authenticate, controller.logoutHandler);

/**
 * @openapi
 * /auth/otp/request:
 *   post:
 *     tags: [Auth]
 *     summary: Request an OTP code (mocked - always logs 123456 in dev)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destination, purpose]
 *             properties:
 *               destination: { type: string, description: 'Email or phone number' }
 *               purpose: { type: string, enum: [login, register, reset_password] }
 *     responses:
 *       200: { description: OTP sent }
 */
router.post('/otp/request', v.otpRequestValidation, validate, controller.requestOtpHandler);

/**
 * @openapi
 * /auth/otp/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify an OTP code and authenticate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destination, code, purpose]
 *             properties:
 *               destination: { type: string }
 *               code: { type: string }
 *               purpose: { type: string, enum: [login, register, reset_password] }
 *     responses:
 *       200: { description: OTP verified }
 */
router.post('/otp/verify', v.otpVerifyValidation, validate, controller.verifyOtpHandler);

/**
 * @openapi
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with a Google ID token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken: { type: string }
 *     responses:
 *       200: { description: Authenticated via Google }
 */
router.post('/google', v.googleAuthValidation, validate, controller.googleSignInHandler);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request a password reset OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: Reset code sent if account exists }
 */
router.post('/forgot-password', v.forgotPasswordValidation, validate, controller.forgotPasswordHandler);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using the OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, newPassword]
 *             properties:
 *               email: { type: string }
 *               code: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Password reset }
 */
router.post('/reset-password', v.resetPasswordValidation, validate, controller.resetPasswordHandler);

export default router;
