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

  sendResponse<House>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House retrieve successfully !!',
    data: result,
  });
});

export const HouseController = {
  createNew,
  getAllHouse,
  getSingleHouse,
};
