/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SuperAdminService } from './superAdmin.service';

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAll();
  sendResponse<Admin[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra charges retrieved !',
    data: result,
  });
});
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getSingle(req.params.id);
  sendResponse<Admin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin retrieved !',
    data: result,
  });
});
const removeAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.removeAdmin(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin remove !',
    data: result,
  });
});

export const SuperAdminController = {
  getAll,
  getSingle,
  removeAdmin,
};
