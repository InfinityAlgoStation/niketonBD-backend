import { Feedback } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createNew = async (payload: Feedback): Promise<Feedback> => {
  const { houseId, tenantId } = payload;

  const isContractExist = await prisma.contract.findFirst({
    where: { houseId: houseId, tenantId: tenantId },
  });
  if (!isContractExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not tenant of this house'
    );
  }

  const result = await prisma.feedback.create({
    data: payload,
  });
  return result;
};

const getAll = async (): Promise<Feedback[]> => {
  const result = await prisma.feedback.findMany({
    include: { house: true, tenant: true },
  });
  return result;
};

const getSingle = async (id: string): Promise<Feedback | null> => {
  const result = await prisma.feedback.findUnique({
    where: { id },
    include: { house: true, tenant: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found !');
  }

  return result;
};
const updateSingle = async (
  id: string,
  data: Partial<Feedback>
): Promise<Feedback | null> => {
  const isExist = await prisma.feedback.findUnique({
    where: { id },
    include: { house: true, tenant: true },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found !');
  }
  const result = await prisma.feedback.update({ where: { id }, data });

  return result;
};

const deleteSingle = async (id: string): Promise<Feedback | null> => {
  const isExist = await prisma.feedback.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found !');
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
