/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedbackService } from './feedback.service';
import { Feedback } from '@prisma/client';

const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.createNew(req.body);
  sendResponse<Feedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback added !',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getAll();
  sendResponse<Feedback[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback retrieved !',
    data: result,
  });
});
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getSingle(req.params.id);
  sendResponse<Feedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback retrieved !',
    data: result,
  });
});
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await FeedbackService.updateSingle(id, data);
  sendResponse<Feedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback updated !',
    data: result,
  });
});

const deleteSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await FeedbackService.updateSingle(id, data);
  sendResponse<Feedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback deleted !',
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
