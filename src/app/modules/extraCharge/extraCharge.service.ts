import { ExtraCharge } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createNew = async (payload: ExtraCharge): Promise<ExtraCharge> => {
  const result = await prisma.extraCharge.create({
    data: payload,
  });
  return result;
};

const getAll = async (): Promise<ExtraCharge[]> => {
  const result = await prisma.extraCharge.findMany();
  return result;
};

const getSingle = async (id: string): Promise<ExtraCharge | null> => {
  const result = await prisma.extraCharge.findUnique({ where: { id } });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Extra charge not found !');
  }

  return result;
};
const updateSingle = async (
  id: string,
  data: Partial<ExtraCharge>
): Promise<ExtraCharge | null> => {
  const isExist = await prisma.extraCharge.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Extra charge not found !');
  }
  const result = await prisma.extraCharge.update({ where: { id }, data });

  return result;
};

const deleteSingle = async (id: string): Promise<ExtraCharge | null> => {
  const isExist = await prisma.extraCharge.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Extra charge not found !');
  }
  const result = await prisma.extraCharge.delete({ where: { id } });

  return result;
};

export const ExtraChargeServices = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
