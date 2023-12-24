/* eslint-disable @typescript-eslint/no-explicit-any */

import { House } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { HouseServices } from './houses.services';

const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await HouseServices.createNew(req.body);
  sendResponse<House>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New house added !',
    data: result,
  });
});

export const HouseController = {
  createNew,
};
