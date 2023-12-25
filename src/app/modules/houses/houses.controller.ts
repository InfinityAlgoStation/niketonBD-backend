/* eslint-disable @typescript-eslint/no-explicit-any */

import { House } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { houseFilterableFields } from './houses.constant';
import { HouseServices } from './houses.services';

const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await HouseServices.createNew(req.body);
  sendResponse<House>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New house added !',
    data: result,
  });
});

const getAllHouse = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, houseFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await HouseServices.getAllHouse(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Houses fetched successfully !!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleHouse = catchAsync(async (req: Request, res: Response) => {
  const result = await HouseServices.getSingleHouseDetails(req.params.id);

  sendResponse<House | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House retrieve successfully !!',
    data: result,
  });
});
const updateHouse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const { id: userId, role: userRole } = req.user as any;
  const result = await HouseServices.updateHouse(id, data, userId, userRole);

  sendResponse<House>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House updated successfully !!',
    data: result,
  });
});
const deleteHouse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { id: userId, role: userRole } = req.user as any;
  const result = await HouseServices.deleteHouse(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House delete successfully !!',
    data: result,
  });
});

const addAmenityHouse = catchAsync(async (req: Request, res: Response) => {
  const { houseId, amenityId } = req.body;
  // const { id: userId, role: userRole } = req.user as any;
  const result = await HouseServices.addHouseAmenity(houseId, amenityId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House updated successfully !!',
    data: result,
  });
});

export const HouseController = {
  createNew,
  getAllHouse,
  getSingleHouse,
  updateHouse,
  deleteHouse,
  addAmenityHouse,
};
