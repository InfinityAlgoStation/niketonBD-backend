import express from 'express';
import { HousePostRoutes } from '../modules/HousePost/housePost.route';
import { AmenityRoutes } from '../modules/amenity/amenity.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ExtraChargeRoutes } from '../modules/extraCharge/extraCharge.routes';
import { HouseRoutes } from '../modules/houses/houses.routes';
import { OwnerRotes } from '../modules/owners/ownner.routes';
import { RequestRoute } from '../modules/request/request.route';
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
  {
    path: '/extraCharge',
    route: ExtraChargeRoutes,
  },
  {
    path: '/houses',
    route: HouseRoutes,
  },
  {
    path: '/housePost',
    route: HousePostRoutes,
  },
  {
    path: '/owners',
    route: OwnerRotes,
  },
  {
    path: '/request',
    route: RequestRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
