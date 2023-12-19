/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UsersServices } from './users.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.getAll();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'user data fetched!!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UsersServices.getSingle(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user data retrieved!!',
    data: result,
  });
});
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as any;
  const result = await UsersServices.getProfile(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user profile data retrieved!!',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = req.user as any;
  const result = await UsersServices.updateUser(id, userId, role, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UsersServices.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user delete successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getProfile,
};
