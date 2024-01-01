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
import { otpGenerator, randomString } from '../../../helpers/stringGenrator';
import prisma from '../../../shared/prisma';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const userRegistration = async (
  payload: User,
  passKey: string
): Promise<User> => {
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

  // Start a Prisma transaction
  const result = await prisma.$transaction(async prismaClient => {
    // Encrypt password
    const encryptedPassword = await encryptPassword(password);

    // Create user with encrypted password
    const createdUser = await prismaClient.user.create({
      data: { ...othersData, password: encryptedPassword },
    });

    if (!createdUser?.email) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not created');
    }

    // Create Owner or Tenant based on the role
    let relatedModel;
    if (othersData?.role === 'OWNER') {
      relatedModel = await prismaClient.owner.create({
        data: { userId: createdUser.id },
      });
    } else if (othersData?.role === 'TENANT') {
      relatedModel = await prismaClient.tenant.create({
        data: { userId: createdUser.id },
      });
    } else if (othersData?.role === 'SUPERADMIN') {
      const savedPassKey = config.sAdminPassKey;
      console.log(savedPassKey, passKey);

      if (savedPassKey !== passKey) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Please provide valid passkey'
        );
      }
      relatedModel = await prismaClient.superAdmin.create({
        data: { userId: createdUser.id },
      });
    }

    if (!relatedModel?.userId) {
      // If the related model is not created successfully, throw an error to roll back the transaction
      throw new Error('Related model not created');
    }

    // Send email confirmation
    const payload1: IEmailInfo = {
      from: `${config.email_host.user}`,
      to: createdUser.email,
      subject: 'Registration Done',
      text: 'Welcome to Niketon BD',
      html: '<b><h1>Niketon BD</h1></b>',
    };

    const emailSendResult = await sentEmail(payload1);
    if (emailSendResult.accepted.length === 0) {
      // If email sending fails, throw an error to roll back the transaction
      throw new Error('Email send failed');
    }

    // Return the created user
    if (othersData?.role === 'OWNER') {
      return { ...createdUser, owner: relatedModel };
    } else if (othersData?.role === 'TENANT') {
      return { ...createdUser, tenant: relatedModel };
    } else if (othersData?.role === 'SUPERADMIN') {
      return { ...createdUser, superAdmin: relatedModel };
    }

    return createdUser;
  });

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
    if (emailSendResult.accepted.length === 0) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Email send failed !'
      );
    }
  }
};

const sendEmailForVerifyAccount = async (
  user: JwtPayload | null,
  token: string | undefined
) => {
  const isUserExist = await prisma.user.findUnique({ where: { id: user?.id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }
  // make uniq token with jwt
  const newToken = token + randomString();

  const saveTokenDB = await prisma.user.update({
    where: { id: user?.id },
    data: { token: newToken },
  });

  if (!saveTokenDB?.token) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Verification failed');
  }

  const payload1: IEmailInfo = {
    from: `${config.email_host.user}`,
    to: isUserExist?.email,
    subject: 'Email Verification of Niketon BD',
    text: `Hi ${isUserExist?.userName} ,`,
    html: `<div><b><h1>Niketon BD</h1></b> </br> <a href="${config.base_url_frontend}/verifyEmail/${newToken}">Click here to verify your email</a> </div>`,
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const emailSendResult = await sentEmail(payload1);
  if (emailSendResult.accepted.length === 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email send failed !');
  }
};

const verifyEmail = async (
  user: JwtPayload | null,
  token: string | undefined
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: user?.id },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }
  const isTokenSame = isUserExist?.token === token;

  if (!isTokenSame) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Verification failed');
  }

  const removeToken = await prisma.user.update({
    where: { id: user?.id },
    data: { token: null, verified: true },
  });

  if (!removeToken?.token === null && removeToken?.verified === false) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Verification failed');
  }

  const payload1: IEmailInfo = {
    from: `${config.email_host.user}`,
    to: isUserExist?.email,
    subject: 'Email Verified  Niketon BD',
    text: `Hi ${isUserExist?.userName} ,`,
    html: `Your Email is Verified`,
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const emailSendResult = await sentEmail(payload1);
  if (emailSendResult.accepted.length === 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email send failed !');
  }
};

const forgetPasswordOTPSend = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const generatedOTP = otpGenerator();
  const saveTokenDB = await prisma.user.update({
    where: { email: email },
    data: { token: generatedOTP },
  });

  if (!saveTokenDB?.token) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Otp Send failed !');
  }

  const payload1: IEmailInfo = {
    from: `${config.email_host.user}`,
    to: isUserExist?.email,
    subject: 'Forget password of Niketon BD',
    text: `Hi ${isUserExist?.userName} ,`,
    html: `<div><b><h1>Niketon BD</h1></b> </br> <h4> Your OTP is  </h4></br> <h1> <b>${generatedOTP}</b>  </h1></div>`,
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const emailSendResult = await sentEmail(payload1);
  if (emailSendResult.accepted.length === 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email send failed !');
  }
};

const forgetPasswordOTPVerify = async (email: string, otp: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const isTokenSame = isUserExist?.token === otp;

  if (!isTokenSame) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP not matched');
  }
};

const forgetPasswordSetNewPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  // password validity check
  const passwordValidity = checkPasswordStrength(email, newPassword);
  if (!passwordValidity.validity) {
    throw new ApiError(httpStatus.BAD_REQUEST, passwordValidity.msg);
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email: email, token: otp },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  // encrypt password
  const encryptedPassword = await encryptPassword(newPassword);

  const setNewPassword = await prisma.user.update({
    where: { email: email, token: otp },
    data: { token: null, password: encryptedPassword },
  });

  if (
    !setNewPassword?.token === null &&
    setNewPassword?.password === newPassword
  ) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to set new password !'
    );
  }

  // send mail that password changed

  const payload1: IEmailInfo = {
    from: `${config.email_host.user}`,
    to: isUserExist?.email,
    subject: 'Successfully change password of Niketon BD',
    text: `Hi ${isUserExist?.userName} ,`,
    html: `<div><b><h1>Niketon BD</h1></b> </br> <h1> <b>Your password is changed</b>  </h1></div>`,
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const emailSendResult = await sentEmail(payload1);
  if (emailSendResult.accepted.length === 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email send failed !');
  }
};

const superAdminMakeAdmin = async (
  userId: string,
  userRole: string,
  payload: User
) => {
  if (userRole !== 'SUPERADMIN') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not Super admin');
  }
  const isSAdminExist = await prisma.superAdmin.findUnique({
    where: { userId: userId },
  });
  if (!isSAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Super Admin not found');
  }

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

  // Start a Prisma transaction
  const result = await prisma.$transaction(async prismaClient => {
    // Encrypt password
    const encryptedPassword = await encryptPassword(password);

    // Create user with encrypted password
    const createdUser = await prismaClient.user.create({
      data: { ...othersData, password: encryptedPassword },
    });

    if (!createdUser?.email) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin not created');
    }

    // Create Owner or Tenant based on the role
    const relatedModel = await prismaClient.admin.create({
      data: { userId: createdUser?.id, superAdminId: isSAdminExist?.id },
    });

    if (!relatedModel?.userId) {
      // If the related model is not created successfully, throw an error to roll back the transaction
      throw new Error('Admin model not created');
    }

    // Send email confirmation
    const payload1: IEmailInfo = {
      from: `${config.email_host.user}`,
      to: createdUser.email,
      subject: 'Registration Done',
      text: 'Welcome to Niketon BD',
      html: '<b><h1>Niketon BD</h1></b>',
    };

    const emailSendResult = await sentEmail(payload1);
    if (emailSendResult.accepted.length === 0) {
      // If email sending fails, throw an error to roll back the transaction
      throw new Error('Email send failed');
    }

    return { ...createdUser, admin: relatedModel };
  });

  return result;
};

export const AuthServices = {
  userRegistration,
  userLogin,
  refreshToken,
  changePassword,
  sendEmailForVerifyAccount,
  verifyEmail,
  forgetPasswordOTPSend,
  forgetPasswordOTPVerify,
  forgetPasswordSetNewPassword,
  superAdminMakeAdmin,
};
