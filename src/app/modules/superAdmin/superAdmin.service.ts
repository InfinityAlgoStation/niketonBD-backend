import { Admin } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAll = async (): Promise<Admin[]> => {
  const result = await prisma.admin.findMany({
    include: { user: true, madeBy: { include: { user: true } } },
  });
  return result;
};

const getSingle = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: { id },
    include: { user: true, madeBy: { include: { user: true } } },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  return result;
};

const removeAdmin = async (id: string) => {
  const result = await prisma.$transaction(async prismaClient => {
    const isAdminExist = await prisma.admin.findUnique({
      where: { id: id },
      include: { user: true },
    });
    if (!isAdminExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
    }
    const deleteAdmin = await prismaClient.admin.delete({ where: { id: id } });
    if (!deleteAdmin) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not delete !');
    }
    const deleteAdminUser = await prismaClient.user.delete({
      where: { id: isAdminExist?.user.id },
    });
    if (!deleteAdminUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Admin user not delete !');
    }
    return deleteAdmin;
  });
  return result;
};

export const SuperAdminService = {
  getAll,
  getSingle,
  removeAdmin,
};
