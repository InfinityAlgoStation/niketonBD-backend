import { Amenity } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createNew = async (payload: Amenity): Promise<Amenity> => {
  const result = await prisma.amenity.create({
    data: payload,
  });
  return result;
};

const getAll = async (): Promise<Amenity[]> => {
  const result = await prisma.amenity.findMany();
  return result;
};

const getSingle = async (id: string): Promise<Amenity | null> => {
  const result = await prisma.amenity.findUnique({ where: { id } });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Amenity not found !');
  }

  return result;
};

export const AmenityServices = {
  createNew,
  getAll,
  getSingle,
};
