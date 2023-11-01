import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthServices } from './auth.service';

const userRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.userRegistration(req.body);

  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created !!',
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.userLogin(req.body);
  const { refreshToken, ...others } = result;
  // set refresh token in to cookie
  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOption);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthServices.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
  });
});

const sendEmailForVerifyAccount = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const user = req.user;

    await AuthServices.sendEmailForVerifyAccount(user, token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Send email for verification',
    });
  }
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = req.user;

  await AuthServices.verifyEmail(user, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verification Done',
  });
});

const forgetPasswordOTPSend = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    AuthServices.forgetPasswordOTPSend(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP SEND TO EMAIL !',
    });
  }
);

export const AuthController = {
  userRegistration,
  userLogin,
  refreshToken,
  changePassword,
  sendEmailForVerifyAccount,
  verifyEmail,
  forgetPasswordOTPSend,
};
