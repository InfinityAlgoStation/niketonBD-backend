import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TenantService } from './tenant.service';

const houseBookRequest = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id } = req.user as any;
  const result = await TenantService.requestBookHouse(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking request sent !',
    data: result,
  });
});
const houseLeaveRequest = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id } = req.user as any;
  const result = await TenantService.requestLeaveHouse(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leaving request sent !',
    data: result,
  });
});

export const TenantController = {
  houseBookRequest,
  houseLeaveRequest,
};
