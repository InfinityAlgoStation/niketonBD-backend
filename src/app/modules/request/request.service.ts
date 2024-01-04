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
  const findContract = await prisma.contract.findMany({
    where: {
      status: 'RUNNING',
      ownerId: ownerId,
      tenantId: tenantId,
      houseId: houseId,
    },
  });

  if (findContract.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are already tenant of this house'
    );
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
      // requestStatus: payload.requestStatus,
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

  const findContract = await prisma.contract.findMany({
    where: {
      status: 'RUNNING',
      ownerId: ownerId,
      tenantId: tenantId,
      houseId: houseId,
    },
  });

  if (findContract.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Currently you are not tenant of this house'
    );
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
const updateBookingRequestStatus = async (
  userRole: string,
  id: string,
  data: Partial<Request>
) => {
  const isExist = await prisma.request.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (data?.requestStatus === 'ACCEPTED') {
    if (userRole === 'TENANT') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You are not able to accept request'
      );
    }
    const result = await prisma.$transaction(async prismaClient => {
      const changeRequestStatus = await prismaClient.request.update({
        where: { id },
        data: { requestStatus: 'ACCEPTED' },
        include: {
          house: true,
          owner: true,
          tenant: true,
        },
      });

      if (!changeRequestStatus) {
        throw new ApiError(
          httpStatus.NOT_MODIFIED,
          'Request status failed to change '
        );
      }

      const createContract = await prismaClient.contract.create({
        data: {
          status: 'RUNNING',
          owner: { connect: { id: changeRequestStatus.ownerId } },
          tenant: { connect: { id: changeRequestStatus.tenantId } },
          house: { connect: { id: changeRequestStatus.houseId } },
        },
      });
      if (!createContract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create contract');
      }

      return changeRequestStatus;
    });
    return result;
  } else {
    const result = await prisma.request.update({
      where: { id },
      data: { requestStatus: 'CANCEL' },
    });

    return result;
  }
};

const updateLeaveRequestStatus = async (
  userRole: string,
  id: string,
  data: Partial<Request>
) => {
  const isExist = await prisma.request.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (data?.requestStatus === 'ACCEPTED') {
    if (userRole === 'TENANT') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You are not able to accept request'
      );
    }

    const result = await prisma.$transaction(async prismaClient => {
      const changeStatus = await prismaClient.request.update({
        where: { id },
        data: { requestStatus: 'ACCEPTED' },
      });

      if (!changeStatus) {
        throw new ApiError(
          httpStatus.NOT_MODIFIED,
          'Request status failed to change '
        );
      }

      const findContract = await prismaClient.contract.findMany({
        where: {
          status: 'RUNNING',
          ownerId: isExist?.ownerId,
          tenantId: isExist?.tenantId,
          houseId: isExist?.houseId,
        },
      });
      const updateContract = await prismaClient.contract.update({
        where: {
          id: findContract[0].id,
        },

        data: { status: 'END' },
      });
      if (!updateContract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to end contract');
      }

      return changeStatus;
    });
    return result;
  } else {
    const result = await prisma.request.update({
      where: { id },
      data: { requestStatus: 'CANCEL' },
    });

    return result;
  }
};

const getAllRequest = async (userId: string, userRole: string) => {
  const isExist = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: { include: { user: true } },
      owner: { include: { user: true } },
    },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
    const result = await prisma.request.findMany({
      include: { owner: true, tenant: true, house: true },
    });
    return result;
  } else if (userRole === 'OWNER') {
    const result = await prisma.request.findMany({
      where: { ownerId: isExist?.owner?.id },
      include: { owner: true, tenant: true, house: true },
    });
    return result;
  } else {
    const result = await prisma.request.findMany({
      where: { tenantId: isExist?.tenant?.id },
      include: { owner: true, tenant: true, house: true },
    });
    return result;
  }
};

const getSingleRequest = async (
  requestId: string,
  userId: string,
  userRole: string
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: true, owner: true },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isRequestExist = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!isRequestExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
    const result = await prisma.request.findUnique({
      where: { id: requestId },
      include: { owner: true, tenant: true, house: true },
    });
    return result;
  } else if (userRole === 'OWNER') {
    const result = await prisma.request.findMany({
      where: { id: requestId, ownerId: isUserExist?.owner?.id },
      include: { owner: true, tenant: true, house: true },
    });
    return result;
  } else {
    const result = await prisma.request.findMany({
      where: { id: requestId, tenantId: isUserExist?.tenant?.id },
      include: { owner: true, tenant: true, house: true },
    });
    return result;
  }
};

const requestDelete = async (requestId: string) => {
  const isRequestExist = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!isRequestExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  const result = await prisma.request.delete({ where: { id: requestId } });
  return result;
};

export const RequestService = {
  requestBookHouse,
  requestLeaveHouse,
  updateBookingRequestStatus,
  updateLeaveRequestStatus,
  getAllRequest,
  getSingleRequest,
  requestDelete,
};
