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

  if (
    isExist?.houseOwner?.userId !== userId ||
    userRole === 'ADMIN' ||
    userRole === 'SUPERADMIN'
  ) {
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
  if (
    isExist?.houseOwner?.userId !== userId ||
    userRole === 'ADMIN' ||
    userRole === 'SUPERADMIN'
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not able to make change !'
    );
  }

  const result = await prisma.house.delete({ where: { id } });
  return result;
};

export const HouseServices = {
  createNew,
  getAllHouse,
  getSingleHouseDetails,
  updateHouse,
  deleteHouse,
};
