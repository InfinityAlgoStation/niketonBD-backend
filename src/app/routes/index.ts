import express from 'express';
import { AmenityRoutes } from '../modules/amenity/amenity.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/users/users.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/amenities',
    route: AmenityRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
