import { House } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createNew = async (payload: House): Promise<House> => {
  console.log(payload);

  const result = await prisma.house.create({
    data: payload,
    include: {
      houseOwner: true,
    },
  });
  return result;
};

export const HouseServices = {
  createNew,
};
