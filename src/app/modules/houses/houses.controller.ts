/* eslint-disable @typescript-eslint/no-explicit-any */

import { House } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { HouseServices } from './houses.services';
import pick from '../../../shared/pick';
import { houseFilterableFields } from './houses.constant';
import { paginationFields } from '../../../constants/paginationFields';

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

export const HouseController = {
  createNew,
  getAllHouse,
};
