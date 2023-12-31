import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RequestController } from './request.contoller';
import { RequestZodValidation } from './request.validation';

const router = express.Router();
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  RequestController.getAllRequest
);
router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  RequestController.getSingleRequest
);
router.post(
  '/booking',
  validateRequest(RequestZodValidation.requestBookHouseValidation),
  auth(ENUM_USER_ROLE.TENANT),
  RequestController.houseBookRequest
);
router.post(
  '/leave',
  validateRequest(RequestZodValidation.requestLeaveHouseValidation),
  auth(ENUM_USER_ROLE.TENANT),
  RequestController.houseLeaveRequest
);
router.patch(
  '/updateStatus/:id',
  validateRequest(RequestZodValidation.requestStatusUpdateValidation),
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  RequestController.updateHouseRequest
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestController.requestDelete
);

export const RequestRoute = router;
