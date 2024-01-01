/* eslint-disable @typescript-eslint/no-explicit-any */

import { Feedback } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedbackService } from './feedback.service';

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
  const { id, role } = req.user as any;
  const result = await FeedbackService.getAll(id, role);
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
  const { id: userId, role } = req.user as any;
  const result = await FeedbackService.updateSingle(id, data, userId, role);
  sendResponse<Feedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback updated !',
    data: result,
  });
});

const deleteSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = req.user as any;
  const result = await FeedbackService.deleteSingle(id, userId, role);
  sendResponse<Feedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback deleted !',
    data: result,
  });
});

export const FeedbackController = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
