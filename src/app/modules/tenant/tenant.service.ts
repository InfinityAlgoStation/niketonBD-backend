import { Request } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const requestBookHouse = async (
  payload: Request,
  userId: string
): Promise<Request> => {
  const { houseId, ownerId, tenantId } = payload;

  const isHouseExist = await prisma.house.findUnique({
    where: { id: houseId },
    include: { houseOwner: true },
  });

  if (!isHouseExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not found');
  }
  if (isHouseExist?.ownerId !== ownerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Owner not matched');
  }
  if (!isHouseExist?.houseOwner?.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Owner not found');
  }

  const isTenantExist = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (tenantId !== isTenantExist?.tenant?.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not valid user');
  }

  const result = await prisma.request.create({
    data: {
      house: {
        connect: { id: houseId },
      },
      owner: {
        connect: { id: ownerId },
      },
      tenant: {
        connect: { id: tenantId },
      },
      requestStatus: payload.requestStatus,
      requestType: 'BOOKING',
    },
  });

  return result;
};

const requestLeaveHouse = async (
  payload: Request,
  userId: string
): Promise<Request> => {
  const { houseId, ownerId, tenantId } = payload;

  const isHouseExist = await prisma.house.findUnique({
    where: { id: houseId },
    include: { houseOwner: true },
  });

  if (!isHouseExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not found');
  }
  if (isHouseExist?.ownerId !== ownerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Owner not matched');
  }
  if (!isHouseExist?.houseOwner?.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Owner not found');
  }

  const isTenantExist = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (tenantId !== isTenantExist?.tenant?.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not valid user');
  }

  const result = await prisma.request.create({
    data: {
      house: {
        connect: { id: houseId },
      },
      owner: {
        connect: { id: ownerId },
      },
      tenant: {
        connect: { id: tenantId },
      },
      requestStatus: payload.requestStatus,
      requestType: 'LEAVE',
    },
  });

  return result;
};

export const TenantService = {
  requestBookHouse,
  requestLeaveHouse,
};
