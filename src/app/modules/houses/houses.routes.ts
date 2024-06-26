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
router.get('/:id', HouseController.getSingleHouse);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  HouseController.updateHouse
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
