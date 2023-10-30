import { User } from '@prisma/client';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { encryptPassword } from '../../../helpers/encription';
import { IEmailInfo, sentEmail } from '../../../helpers/nodeMailer';
import prisma from '../../../shared/prisma';

const userRegistration = async (payload: User): Promise<User> => {
  const { password, ...othersData } = payload;

  const encryptedPassword = await encryptPassword(password);
  const newData = { ...othersData, password: encryptedPassword };

  const result = await prisma.user.create({ data: newData });

  if (!result?.email) {
    throw new ApiError(400, 'User not create');
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

// const userLogin=async(payload:)

export const AuthServices = {
  userRegistration,
};
