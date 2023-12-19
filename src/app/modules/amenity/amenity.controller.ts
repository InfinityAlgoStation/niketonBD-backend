import { Amenity } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AmenityServices } from './amenity.service';

const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await AmenityServices.createNew(req.body);
  sendResponse<Amenity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenity added !',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await AmenityServices.getAll();
  sendResponse<Amenity[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenities retrieved !',
    data: result,
  });
});

export const AmenityController = {
  createNew,
  getAll,
};
