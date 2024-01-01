import { Feedback } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createNew = async (payload: Feedback): Promise<Feedback> => {
  const { houseId, tenantId } = payload;

  const isContractExist = await prisma.contract.findFirst({
    where: { houseId: houseId, tenantId: tenantId },
    include: { house: true },
  });
  if (!isContractExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not tenant of this house'
    );
  }

  const result = await prisma.feedback.create({
    data: { ...payload, ownerId: isContractExist.house.ownerId },
  });
  return result;
};

const getAll = async (
  userId: string,
  userRole: string
): Promise<Feedback[]> => {
  if (userRole === 'OWNER') {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { owner: true },
    });
    if (!findUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User details not found');
    }
    const result = await prisma.feedback.findMany({
      where: { ownerId: findUser?.owner?.id },
      include: { house: true, tenant: true, Owner: true },
    });
    return result;
  }

  if (userRole === 'TENANT') {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!findUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User details not found');
    }

    const result = await prisma.feedback.findMany({
      where: { tenantId: findUser?.tenant?.id },
      include: { house: true, tenant: true, Owner: true },
    });
    return result;
  }

  const result = await prisma.feedback.findMany({
    include: { house: true, tenant: true, Owner: true },
  });
  return result;
};

const getSingle = async (id: string): Promise<Feedback | null> => {
  const result = await prisma.feedback.findUnique({
    where: { id },
    include: { house: true, tenant: true, Owner: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found !');
  }

  return result;
};
const updateSingle = async (
  id: string,
  data: Partial<Feedback>,
  userId: string,
  userRole: string
): Promise<Feedback | null> => {
  const isExist = await prisma.feedback.findUnique({
    where: { id },
    include: { house: true, tenant: true },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found !');
  }

  if (userRole === 'TENANT' && isExist?.tenant?.userId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to change feedback'
    );
  }
  const result = await prisma.feedback.update({ where: { id }, data });

  return result;
};

const deleteSingle = async (
  id: string,
  userId: string,
  userRole: string
): Promise<Feedback | null> => {
  const isExist = await prisma.feedback.findUnique({
    where: { id },
    include: { tenant: true },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found !');
  }
  if (userRole === 'TENANT' && isExist?.tenant?.userId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to delete feedback'
    );
  }
  const result = await prisma.feedback.delete({
    where: { id },
    include: { house: true, tenant: true },
  });

  return result;
};

export const FeedbackService = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
