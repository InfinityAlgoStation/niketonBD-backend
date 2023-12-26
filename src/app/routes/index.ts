import express from 'express';
import { AmenityRoutes } from '../modules/amenity/amenity.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ExtraChargeRoutes } from '../modules/extraCharge/extraCharge.routes';
import { HouseRoutes } from '../modules/houses/houses.routes';
import { OwnerRotes } from '../modules/owners/ownner.routes';
import { UserRoutes } from '../modules/users/users.routes';
import { HousePostRoutes } from '../modules/HousePost/housePost.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
