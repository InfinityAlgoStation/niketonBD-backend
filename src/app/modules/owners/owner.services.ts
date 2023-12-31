import { Owner } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getSingleOwnerDetails = async (id: string): Promise<Owner | null> => {
  const result = await prisma.owner.findUnique({
    where: { id },
    include: {
      houses: true,
      feedbacks: true,
      user: {
        select: {
          id: true,
          userName: true,
          verified: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Owner not found !');
  }

  return result;
};

/* update house request */

export const OwnersServices = {
  getSingleOwnerDetails,
};
