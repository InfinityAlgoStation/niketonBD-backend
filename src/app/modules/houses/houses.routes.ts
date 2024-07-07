/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/fileUploadHelpers';
import auth from '../../middlewares/auth';
import { HouseController } from './houses.controller';
import { HouseZodValidation } from './houses.validation';
const router = express.Router();
// Extend Request interface to include files property
type MulterRequest = Request & {
  files?: Express.Multer.File[];
};
router.post(
  '/add',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FileUploadHelper.upload.array('files', 5),
  (req: Request, res: Response, next: NextFunction) => {
    const multerReq = req as MulterRequest;
    multerReq.body = HouseZodValidation.createHouseZodSchema.parse(
      JSON.parse(multerReq.body.data)
    );
    if (multerReq.files) {
      multerReq.body.fileUrls = multerReq.files.map(
        file => `${config.api_link_Image}/api/v1/houses/image/${file.filename}`
      );
    }

    return HouseController.createNew(multerReq, res, next);
  }
);
router.get('/image/:fileName', async (req: Request, res: Response) => {
  const filePath = await path.join(
    process.cwd(),
    'uploads',
    path.basename(req.params.fileName)
  );
  // Check if the file exists
  await fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
    }
    // Send the image file
    res.sendFile(filePath);
  });
});

router.get('/', HouseController.getAllHouse);
router.get('/:id', HouseController.getSingleHouse);

router.patch(
  '/addImages/:houseId',
  auth(ENUM_USER_ROLE.OWNER),
  FileUploadHelper.upload.array('files', 5), // Ensure 'files' matches the field name used in the form
  async (req: Request, res: Response, next: NextFunction) => {
    const multerReq = req as MulterRequest;

    try {
      if (multerReq.files) {
        multerReq.body.fileUrls = multerReq.files.map(
          file =>
            `${config.api_link_Image}/api/v1/houses/image/${file.filename}`
        );
      }

      return await HouseController.addImageToProduct(multerReq, res, next);
    } catch (error) {
      return next(error); // Forward the error to the error handler
    }
  }
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.updateHouse
);


router.delete(
  '/deleteHouseImage/:imageId/:houseId',
  auth(ENUM_USER_ROLE.OWNER),
  HouseController.deleteImageFromHouse
);




router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.deleteHouse
);

router.post(
  '/add-aminity',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.addAmenityHouse
);
router.post(
  '/add-extraCharge',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.addExtraChargeHouse
);
router.post(
  '/remove-aminity',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.removeAmenityHouse
);
router.post(
  '/remove-extraCharge',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.removeExtraChargeHouse
);

export const HouseRoutes = router;
