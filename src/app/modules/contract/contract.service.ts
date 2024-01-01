import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAll = async (userId: string, userRole: string) => {
  const result = await prisma.contract.findMany({
    include: { tenant: true, owner: true, house: true },
  });
  if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
    return result;
  } else {
    if (userRole === 'OWNER') {
      const userInfo = await prisma.user.findUnique({
        where: { id: userId },
        include: { owner: true },
      });

      const result = await prisma.contract.findMany({
        where: { ownerId: userInfo?.owner?.id },
        include: { tenant: true, owner: true, house: true },
      });
      return result;
    }
    if (userRole === 'TENANT') {
      const userInfo = await prisma.user.findUnique({
        where: { id: userId },
        include: { tenant: true },
      });

      const result = await prisma.contract.findMany({
        where: { tenantId: userInfo?.tenant?.id },
        include: { tenant: true, owner: true, house: true },
      });
      return result;
    }
  }
};

const getSingle = async (id: string, userId: string, userRole: string) => {
  const result = await prisma.contract.findUnique({
    where: { id },
    include: { tenant: true, owner: true, house: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  }

  if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
    return result;
  } else {
    if (userRole === 'OWNER' && userId !== result?.owner?.userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Its not your contract');
    }
    if (userRole === 'TENANT' && userId !== result?.tenant?.userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Its not your contract');
    }
  }

  return result;
};

const deleteContract = async (id: string) => {
  const isExist = await prisma.contract.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  }
  const result = await prisma.contract.delete({ where: { id } });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delete failed');
  }
  return result;
};

export const ContractService = {
  getAll,
  getSingle,
  deleteContract,
};
