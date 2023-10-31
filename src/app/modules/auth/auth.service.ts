import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { validateEmail } from '../../../helpers/checkEmailFormateValidity';
import { checkPasswordStrength } from '../../../helpers/checkPasswordStrength';
import {
  encryptPassword,
  isPasswordMatched,
} from '../../../helpers/encription';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IEmailInfo, sentEmail } from '../../../helpers/nodeMailer';
import prisma from '../../../shared/prisma';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const userRegistration = async (payload: User): Promise<User> => {
  const { password, ...othersData } = payload;
  //check email formate validity
  if (!validateEmail(othersData.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email formate is not valid');
  }

  // password validity check
  const passwordValidity = checkPasswordStrength(othersData.email, password);
  if (!passwordValidity.validity) {
    throw new ApiError(httpStatus.BAD_REQUEST, passwordValidity.msg);
  }

  const encryptedPassword = await encryptPassword(password);
  const newData = { ...othersData, password: encryptedPassword };

  const result = await prisma.user.create({ data: newData });

  if (!result?.email) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not create');
  }
  // sent email confirmation that successfully Register

  if (result?.email) {
    const payload1: IEmailInfo = {
      from: `${config.email_host.user}`,
      to: result?.email,
      subject: 'Registration Done',
      text: 'Welcome to Niketon BD',
      html: '<b><h1>Niketon BD</h1></b>',
    };
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const emailSendResult = await sentEmail(payload1);
  }

  return result;
};

const userLogin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email: email } });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist !');
  }

  if (
    isUserExist.password &&
    !(await isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is not matched');
  }

  // create user access token and refresh token
  const { id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, role, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role, email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  // generate user access token
  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  console.log(user);

  const isUserExist = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is not matched');
  }

  // password validity check
  const passwordValidity = checkPasswordStrength(
    isUserExist.email,
    newPassword
  );
  if (!passwordValidity.validity) {
    throw new ApiError(httpStatus.BAD_REQUEST, passwordValidity.msg);
  }

  const newEncryptedPassword = await encryptPassword(newPassword);
  const result = await prisma.user.update({
    where: { id: isUserExist.id },
    data: { password: newEncryptedPassword },
  });

  if (result?.id) {
    const payload1: IEmailInfo = {
      from: `${config.email_host.user}`,
      to: result?.email,
      subject: 'Password change of Niketon BD',
      text: `Hi ${isUserExist?.userName} your password has been successfully updated`,
      html: '<b><h1>Niketon BD</h1></b>',
    };
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const emailSendResult = await sentEmail(payload1);
  }
};

export const AuthServices = {
  userRegistration,
  userLogin,
  refreshToken,
  changePassword,
};
