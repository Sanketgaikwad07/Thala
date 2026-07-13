import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from './auth.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, data: result });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json({ success: true, data: result });
});

export const logoutHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = authService.logout(req.user!.id);
  res.json({ success: true, data: result });
});

export const requestOtpHandler = asyncHandler(async (req: Request, res: Response) => {
  const { destination, purpose } = req.body;
  const result = authService.requestOtp(destination, purpose);
  res.json({ success: true, data: result });
});

export const verifyOtpHandler = asyncHandler(async (req: Request, res: Response) => {
  const { destination, code, purpose } = req.body;
  const result = await authService.verifyOtp(destination, code, purpose);
  res.json({ success: true, data: result });
});

export const googleSignInHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.googleSignIn(req.body.idToken);
  res.json({ success: true, data: result });
});

export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = authService.forgotPassword(req.body.email);
  res.json({ success: true, data: result });
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  const result = await authService.resetPassword(email, code, newPassword);
  res.json({ success: true, data: result });
});
