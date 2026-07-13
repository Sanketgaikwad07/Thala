import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../middlewares/auth';
import * as controller from './users.controller';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get the authenticated user's profile (includes computed BMI)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile returned }
 *   patch:
 *     tags: [Users]
 *     summary: Update profile fields (name, age, height, weight, gender, goals, medical conditions...)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile updated }
 *   delete:
 *     tags: [Users]
 *     summary: Permanently delete the authenticated user's account
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Account deleted }
 */
router.get('/me', authenticate, controller.getMeHandler);
router.patch('/me', authenticate, controller.updateMeHandler);
router.delete('/me', authenticate, controller.deleteMeHandler);

/**
 * @openapi
 * /users/me/photo:
 *   post:
 *     tags: [Users]
 *     summary: Upload a profile photo (stored in Cloudinary)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo: { type: string, format: binary }
 *     responses:
 *       200: { description: Photo uploaded }
 */
router.post('/me/photo', authenticate, upload.single('photo'), controller.uploadPhotoHandler);

/**
 * @openapi
 * /users/me/export:
 *   get:
 *     tags: [Users]
 *     summary: Export all of the authenticated user's data as JSON
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Data export }
 */
router.get('/me/export', authenticate, controller.exportMeHandler);

export default router;
