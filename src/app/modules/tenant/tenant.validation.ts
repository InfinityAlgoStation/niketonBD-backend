import { z } from 'zod';

const requestBookHouseValidation = z.object({
  body: z.object({
    requestType: z.enum(['BOOKING'], {
      required_error: 'Request Type is required',
    }),
    requestStatus: z.string().optional(),
    houseId: z.string({ required_error: 'House id is required ' }),
    ownerId: z.string({ required_error: 'Owner id is required' }),
    tenantId: z.string({ required_error: 'Tenant id is required' }),
  }),
});

export const TenantZodValidation = { requestBookHouseValidation };
