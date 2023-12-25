import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { HouseController } from './houses.controller';
import { HouseZodValidation } from './houses.validation';

const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.OWNER),
  validateRequest(HouseZodValidation.createHouseZodSchema),
  HouseController.createNew
);

router.get('/', HouseController.getAllHouse);

export const HouseRoutes = router;
