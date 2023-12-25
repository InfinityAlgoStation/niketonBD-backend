import { Owner } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OwnersServices } from './owner.services';

const getSingleOwnerDetails = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OwnersServices.getSingleOwnerDetails(req.params.id);
    sendResponse<Owner>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Owner details retrieved !',
      data: result,
    });
  }
);

export const OwnerController = {
  getSingleOwnerDetails,
};
