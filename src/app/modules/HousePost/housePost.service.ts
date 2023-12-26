import { HousePost } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createNew = async (payload: HousePost): Promise<HousePost> => {
  const result = await prisma.housePost.create({
    data: payload,
  });
  return result;
};

const getAll = async (): Promise<HousePost[]> => {
  const result = await prisma.housePost.findMany();
  return result;
};

const getSingle = async (id: string): Promise<HousePost | null> => {
  const result = await prisma.housePost.findUnique({ where: { id } });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House post not found !');
  }

  return result;
};
const updateSingle = async (
  id: string,
  data: Partial<HousePost>
): Promise<HousePost | null> => {
  const isExist = await prisma.housePost.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House post not found !');
  }
  const result = await prisma.housePost.update({ where: { id }, data });

  return result;
};

const deleteSingle = async (id: string): Promise<HousePost | null> => {
  const isExist = await prisma.housePost.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House post not found !');
  }
  const result = await prisma.housePost.delete({ where: { id } });

  return result;
};

export const HousePostService = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
