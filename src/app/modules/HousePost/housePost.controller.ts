/* eslint-disable @typescript-eslint/no-explicit-any */

import { HousePost } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { HousePostService } from './housePost.service';

const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await HousePostService.createNew(req.body);
  sendResponse<HousePost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House post added !',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await HousePostService.getAll();
  sendResponse<HousePost[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House post retrieved !',
    data: result,
  });
});
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await HousePostService.getSingle(req.params.id);
  sendResponse<HousePost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House post retrieved !',
    data: result,
  });
});
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await HousePostService.updateSingle(id, data);
  sendResponse<HousePost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House post updated !',
    data: result,
  });
});

const deleteSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await HousePostService.updateSingle(id, data);
  sendResponse<HousePost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House post deleted !',
    data: result,
  });
});

export const HousePostController = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
