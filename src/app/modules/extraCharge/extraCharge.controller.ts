/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExtraCharge } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ExtraChargeServices } from './extraCharge.service';

const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await ExtraChargeServices.createNew(req.body);
  sendResponse<ExtraCharge>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra Charge added !',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ExtraChargeServices.getAll();
  sendResponse<ExtraCharge[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra charges retrieved !',
    data: result,
  });
});
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await ExtraChargeServices.getSingle(req.params.id);
  sendResponse<ExtraCharge>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra Charge retrieved !',
    data: result,
  });
});
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ExtraChargeServices.updateSingle(id, data);
  sendResponse<ExtraCharge>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra Charge updated !',
    data: result,
  });
});

const deleteSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ExtraChargeServices.updateSingle(id, data);
  sendResponse<ExtraCharge>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra Charge deleted !',
    data: result,
  });
});

export const ExtraChargeController = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
