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
const updateSingle = async (
  id: string,
  data: Partial<Amenity>
): Promise<Amenity | null> => {
  const isExist = await prisma.amenity.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Amenity not found !');
  }
  const result = await prisma.amenity.update({ where: { id }, data });

  return result;
};

const deleteSingle = async (id: string): Promise<Amenity | null> => {
  const isExist = await prisma.amenity.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Amenity not found !');
  }
  const result = await prisma.amenity.delete({ where: { id } });

  return result;
};

export const AmenityServices = {
  createNew,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
