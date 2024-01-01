/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContractService } from './contract.service';

const getAll = catchAsync(async (req: Request, res: Response) => {
  const { id, role } = req.user as any;
  const result = await ContractService.getAll(id, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contract retrieved !',
    data: result,
  });
});
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const { id, role } = req.user as any;
  const result = await ContractService.getSingle(req.params.id, id, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contract retrieved !',
    data: result,
  });
});
const deleteSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await ContractService.deleteContract(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contract delete !',
    data: result,
  });
});

export const ContractController = {
  getAll,
  getSingle,
  deleteSingle,
};
