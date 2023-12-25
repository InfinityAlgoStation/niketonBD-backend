import { z } from 'zod';
/* 
enum HouseCategory {
  FLAT
  SINGLE_ROOM
  HOSTEL
  SHOP
  OFFICE
}


*/
const createHouseZodSchema = z.object({
  body: z.object({
    houseName: z.string({ required_error: 'House name is required' }),
    address: z.string({ required_error: 'Address is required' }),
    category: z.enum(['FLAT', 'SINGLE_ROOM', 'HOSTEL', 'SHOP', 'OFFICE'], {
      required_error: 'House category is required ',
    }),
    tenantType: z.enum(['SUBLATE', 'BACHELOR', 'FAMILY'], {
      required_error: 'Tenant type is required ',
    }),
    rentFee: z.number({ required_error: 'Monthly Rent fee is required ' }),
    minBookingCharge: z.number({
      required_error: 'Minimum booking charged is required ',
    }),
  }),
});

const createHousePostZodSchema = z.object({
  body: z.object({
    houseName: z.string({ required_error: 'House name is required' }),
    address: z.string({ required_error: 'Address is required' }),
    contact: z.string({ required_error: 'House contact information required' }),
  }),
});

export const HouseZodValidation = {
  createHouseZodSchema,
  createHousePostZodSchema,
};
