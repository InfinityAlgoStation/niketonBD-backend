import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAll = async (): Promise<User[]> => {
  const result = await prisma.user.findMany();
  return result;
};
const getSingle = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
      tenant: true,
      superAdmin: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist !');
  }

  return result;
};
const getProfile = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        include: {
          houses: true,
        },
      },
      tenant: true,
      superAdmin: true,
    },
  });
  return result;
};
const updateUser = async (
  updateProfileId: string,
  userId: string,
  userRole: string,
  payload: Partial<User>
): Promise<User> => {
  if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
    const isUserExist = await prisma.user.findUnique({
      where: { id: updateProfileId },
    });
    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist !');
    }
    const result = await prisma.user.update({
      where: {
        id: updateProfileId,
      },
      data: payload,
    });
    return result;
  } else {
    const isUserExist = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist !');
    }
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: payload,
    });
    return result;
  }
};
const deleteUser = async (id: string) => {
  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist !');
  }

  if (isUserExist?.role === 'SUPERADMIN') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Super Admin Delete Disable !');
  }

  const result = await prisma.$transaction(async prismaClient => {
    const deleteProfile =
      isUserExist?.role === 'TENANT'
        ? await prismaClient.tenant.delete({ where: { userId: id } })
        : await prismaClient.owner.delete({ where: { userId: id } });

    if (!deleteProfile) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong !');
    }
    const deleteUser = await prismaClient.user.delete({ where: { id } });

    if (!deleteUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong !');
    }
    return deleteUser;
  });

  return result;
};

export const UsersServices = {
  getAll,
  getSingle,
  updateUser,
  deleteUser,
  getProfile,
};
