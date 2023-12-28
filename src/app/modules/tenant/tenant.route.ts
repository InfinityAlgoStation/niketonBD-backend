import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TenantController } from './tenant.contoller';
import { TenantZodValidation } from './tenant.validation';

const router = express.Router();

router.post(
  '/request/booking',
  validateRequest(TenantZodValidation.requestBookHouseValidation),
  auth(ENUM_USER_ROLE.TENANT),
  TenantController.houseBookRequest
);

export const TenantRoute = router;
