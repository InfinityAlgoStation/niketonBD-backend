/* eslint-disable @typescript-eslint/no-explicit-any */
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
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await AmenityServices.getSingle(req.params.id);
  sendResponse<Amenity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenity retrieved !',
    data: result,
  });
});
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AmenityServices.updateSingle(id, data);
  sendResponse<Amenity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenity updated !',
    data: result,
  });
});

const deleteSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AmenityServices.deleteSingle(id);
  sendResponse<Amenity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenity deleted !',
    data: result,
  });
});

export const AmenityController = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
