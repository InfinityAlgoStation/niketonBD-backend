import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OwnerController } from './owner.controller';

const router = express.Router();

router.get(
  '/ownerDetails/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  OwnerController.getSingleOwnerDetails
);

export const OwnerRotes = router;
