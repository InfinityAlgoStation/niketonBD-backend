import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.makeUserZodSchema),
  AuthController.userRegistration
);
router.post(
  '/registerAdmin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AuthController.superAdminMakeAdmin
);
router.post(
  '/register_SAdmin',
  validateRequest(AuthValidation.makeSuperAdminZodSchema),
  AuthController.userRegistration
);
router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.userLogin
);
router.post(
  '/refreshToken',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);
router.post(
  '/changePassword',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);

router.get(
  '/sendVerificationLink',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.TENANT
  ),
  AuthController.sendEmailForVerifyAccount
);
router.post(
  '/verifyEmail/:email/:token',

  AuthController.verifyEmail
);
router.post('/forgetPasswordEmailSend', AuthController.forgetPasswordOTPSend);
router.post('/forgetPasswordOTPVerify', AuthController.forgetPasswordOTPVerify);
router.post(
  '/forgetPasswordSetNewPassword',
  AuthController.forgetPasswordSetNewPassword
);

export const AuthRoutes = router;
