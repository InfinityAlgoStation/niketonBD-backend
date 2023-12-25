/* eslint-disable @typescript-eslint/no-explicit-any */
import { House } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { houseSearchableFields } from './houses.constant';

const createNew = async (payload: House): Promise<House> => {
  const result = await prisma.house.create({
    data: payload,
    include: {
      houseOwner: true,
    },
  });
  return result;
};

const getAllHouse = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<House[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, minRentFee, maxRentFee, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: houseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const conditions = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
    andConditions.push({ AND: conditions });
  }

  const minRentFeeFloat = parseFloat(minRentFee);
  const maxRentFeeFloat = parseFloat(maxRentFee);

  if (!isNaN(minRentFeeFloat)) {
    andConditions.push({
      rentFee: {
        gte: minRentFeeFloat,
      },
    });
  }
  if (!isNaN(maxRentFeeFloat)) {
    andConditions.push({
      rentFee: {
        lte: maxRentFeeFloat,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.house.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.house.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleHouseDetails = async (id: string): Promise<House | null> => {
  const result = await prisma.house.findUnique({ where: { id } });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House details not found');
  }
  return result;
};

const updateHouse = async (
  id: string,
  data: Partial<House>,
  userId: string,
  userRole: string
): Promise<House | null> => {
  const isExist = await prisma.house.findUnique({
    where: { id },
    include: { houseOwner: true },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not exist !');
  }

  if (isExist?.houseOwner?.userId !== userId && userRole === 'OWNER') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }

  const result = await prisma.house.update({ where: { id }, data });
  return result;
};

const deleteHouse = async (
  id: string,
  userId: string,
  userRole: string
): Promise<House | null> => {
  const isExist = await prisma.house.findUnique({
    where: { id },
    include: { houseOwner: true },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not exist !');
  }

  if (userRole === 'OWNER' && isExist?.houseOwner?.userId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }

  const result = await prisma.house.delete({ where: { id } });
  return result;
};

const addHouseAmenity = async (
  houseId: string,
  amenityId: string,
  userId: string,
  userRole: string
) => {
  const isExist = await prisma.house.findUnique({
    where: { id: houseId },
    include: { houseOwner: true },
  });

  const isAminityExist = await prisma.amenity.findUnique({
    where: { id: amenityId },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not exist !');
  }

  if (!isAminityExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Amenity not exist !');
  }

  if (isExist?.houseOwner?.userId !== userId && userRole === 'OWNER') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }

  const result = await prisma.houseAmenity.delete({
    where: {
      houseId_amenityId: {
        houseId: houseId,
        amenityId: amenityId,
      },
    },
  });

  return result;
};

const removeAmenityHouse = async (
  houseId: string,
  amenityId: string,
  userId: string,
  userRole: string
) => {
  const isExist = await prisma.house.findUnique({
    where: { id: houseId },
    include: { houseOwner: true },
  });

  const isAminityExist = await prisma.amenity.findUnique({
    where: { id: amenityId },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not exist !');
  }

  if (!isAminityExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Amenity not exist !');
  }

  if (isExist?.houseOwner?.userId !== userId && userRole === 'OWNER') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }
  const result = await prisma.houseAmenity.delete({
    where: {
      houseId_amenityId: {
        houseId: houseId,
        amenityId: amenityId,
      },
    },
  });

  return result;
};

const addHouseExtraCharge = async (
  houseId: string,
  extraChargeId: string,
  userId: string,
  userRole: string
) => {
  const isExist = await prisma.house.findUnique({
    where: { id: houseId },
    include: { houseOwner: true },
  });

  const isExtraChargeExist = await prisma.extraCharge.findUnique({
    where: { id: extraChargeId },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not exist !');
  }

  if (!isExtraChargeExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtraCharge not exist !');
  }

  if (isExist?.houseOwner?.userId !== userId && userRole === 'OWNER') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }

  const result = await prisma.houseExtraCharge.create({
    data: {
      house: {
        connect: { id: houseId },
      },
      extraCharge: {
        connect: { id: extraChargeId },
      },
    },
  });

  return result;
};

const removeHouseExtraCharge = async (
  houseId: string,
  extraChargeId: string,
  userId: string,
  userRole: string
) => {
  const isExist = await prisma.house.findUnique({
    where: { id: houseId },
    include: { houseOwner: true },
  });

  const isExtraChargeExist = await prisma.extraCharge.findUnique({
    where: { id: extraChargeId },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'House not exist !');
  }

  if (!isExtraChargeExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtraCharge not exist !');
  }

  if (isExist?.houseOwner?.userId !== userId && userRole === 'OWNER') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }

  const result = await prisma.houseExtraCharge.delete({
    where: {
      houseId_extraChargeId: {
        houseId: houseId,
        extraChargeId: extraChargeId,
      },
    },
  });

  return result;
};

export const HouseServices = {
  createNew,
  getAllHouse,
  getSingleHouseDetails,
  updateHouse,
  deleteHouse,
  addHouseAmenity,
  removeAmenityHouse,
  addHouseExtraCharge,
  removeHouseExtraCharge,
};
