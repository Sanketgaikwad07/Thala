import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as service from './sports.service';

export const listSportsHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.listSports() });
});

export const getSportHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: service.getSport(req.params.id) });
});
