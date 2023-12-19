import { Amenity } from '@prisma/client';
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

export const AmenityServices = {
  createNew,
  getAll,
};
