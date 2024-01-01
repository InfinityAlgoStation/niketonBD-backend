import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FeedbackController } from './feedback.controller';
import { FeedbackValidation } from './feedback.validation';

const router = express.Router();

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  FeedbackController.getAll
);
router.get('/:id', FeedbackController.getSingle);

router.post(
  '/',
  validateRequest(FeedbackValidation.createFeedbackZodSchema),
  auth(ENUM_USER_ROLE.TENANT),
  FeedbackController.createNew
);

router.patch(
  '/:id',
  validateRequest(FeedbackValidation.updateFeedbackZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TENANT),
  FeedbackController.updateSingle
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TENANT),
  FeedbackController.deleteSingle
);

export const FeedbackRoutes = router;
