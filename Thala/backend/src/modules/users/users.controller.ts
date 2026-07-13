import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { uploadBufferToCloudinary } from '../../config/cloudinary';
import * as usersService from './users.service';

export const getMeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const profile = usersService.getProfile(req.user!.id);
  res.json({ success: true, data: profile });
});

export const updateMeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const profile = usersService.updateProfile(req.user!.id, req.body);
  res.json({ success: true, data: profile });
});

export const uploadPhotoHandler = asyncHandler(async (req: AuthenticatedRequest & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const url = await uploadBufferToCloudinary(req.file.buffer, 'avatars');
  const profile = usersService.updatePhoto(req.user!.id, url);
  res.json({ success: true, data: profile });
});

export const deleteMeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = usersService.deleteAccount(req.user!.id);
  res.json({ success: true, data: result });
});

export const exportMeHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = usersService.exportData(req.user!.id);
  res.json({ success: true, data: result });
});
