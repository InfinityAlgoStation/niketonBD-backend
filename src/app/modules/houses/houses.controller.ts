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
  const result = await HouseServices.createNew(req);
  sendResponse<House>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New house added !',
    data: result,
  });
});

const addImageToProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await HouseServices.addNewImageForProduct(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'House photo updated ',
    data: result,
  });
});



const deleteImageFromHouse = catchAsync(async (req: Request, res: Response) => {
  const { imageId, houseId } = req.params;
  const { id: userId } = req.user as any;

  const result = await HouseServices.deleteImageFromHouse(
    imageId,
    houseId,
    userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product photo updated ',
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
  const { id: userId, role: userRole } = req.user as any;
  const result = await HouseServices.addHouseAmenity(
    houseId,
    amenityId,
    userId,
    userRole
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenity add to house  successfully !!',
    data: result,
  });
});
const removeAmenityHouse = catchAsync(async (req: Request, res: Response) => {
  const { houseId, amenityId } = req.body;
  const { id: userId, role: userRole } = req.user as any;

  const result = await HouseServices.removeAmenityHouse(
    houseId,
    amenityId,
    userId,
    userRole
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Amenity delete from house successfully !!',
    data: result,
  });
});

const addExtraChargeHouse = catchAsync(async (req: Request, res: Response) => {
  const { houseId, extraChargeId } = req.body;
  const { id: userId, role: userRole } = req.user as any;
  const result = await HouseServices.addHouseExtraCharge(
    houseId,
    extraChargeId,
    userId,
    userRole
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add extra charge from house successfully !!',
    data: result,
  });
});
const removeExtraChargeHouse = catchAsync(
  async (req: Request, res: Response) => {
    const { houseId, extraChargeId } = req.body;
    const { id: userId, role: userRole } = req.user as any;
    const result = await HouseServices.removeHouseExtraCharge(
      houseId,
      extraChargeId,
      userId,
      userRole
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Remove extra charge from house successfully !!',
      data: result,
    });
  }
);

export const HouseController = {
  createNew,
  getAllHouse,
  getSingleHouse,
  updateHouse,
  deleteHouse,
  addAmenityHouse,
  removeAmenityHouse,
  addExtraChargeHouse,
  removeExtraChargeHouse,
  addImageToProduct,
  deleteImageFromHouse,
};
