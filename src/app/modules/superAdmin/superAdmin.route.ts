import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { SuperAdminController } from './superAdmin.controller';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN), SuperAdminController.getAll);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SuperAdminController.getSingle
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SuperAdminController.removeAdmin
);

export const SuperAdminRoutes = router;
