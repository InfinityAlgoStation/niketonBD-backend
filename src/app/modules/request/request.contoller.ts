import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RequestService } from './request.service';

const houseBookRequest = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id } = req.user as any;
  const result = await RequestService.requestBookHouse(req.body, id);
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
  const result = await RequestService.requestLeaveHouse(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leaving request sent !',
    data: result,
  });
});
const updateHouseRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestService.updateHouseRequestStatus(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status updated ',
    data: result,
  });
});
const getAllRequest = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id, role } = req.user as any;
  const result = await RequestService.getAllRequest(id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Request retrieve ',
    data: result,
  });
});
const getSingleRequest = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id, role } = req.user as any;
  const requestId = req.params.id;
  const result = await RequestService.getSingleRequest(requestId, id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Request info retrieve ',
    data: result,
  });
});
const requestDelete = catchAsync(async (req: Request, res: Response) => {
  const requestId = req.params.id;
  const result = await RequestService.requestDelete(requestId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Request deleted ',
    data: result,
  });
});
export const RequestController = {
  houseBookRequest,
  houseLeaveRequest,
  updateHouseRequest,
  getAllRequest,
  getSingleRequest,
  requestDelete,
};
