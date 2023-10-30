import { User } from '@prisma/client';
import { encryptPassword } from '../../../helpers/encription';
import prisma from '../../../shared/prisma';

const userRegistration = async (payload: User): Promise<User> => {
  const { password, ...othersData } = payload;

  const encryptedPassword = await encryptPassword(password);
  const newData = { ...othersData, password: encryptedPassword };

  const result = await prisma.user.create({ data: newData });

  // if (result?.email) {

  // }

  return result;
};

// const userLogin=async(payload:)

export const AuthServices = {
  userRegistration,
};
