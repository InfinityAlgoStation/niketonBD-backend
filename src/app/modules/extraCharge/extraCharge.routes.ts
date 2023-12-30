import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ExtraChargeController } from './extraCharge.controller';

const router = express.Router();

router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ExtraChargeController.createNew
);
router.get(
  '/',

  ExtraChargeController.getAll
);
router.get(
  '/:id',

  ExtraChargeController.getSingle
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ExtraChargeController.updateSingle
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ExtraChargeController.deleteSingle
);

export const ExtraChargeRoutes = router;
