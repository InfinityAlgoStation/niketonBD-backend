import { z } from 'zod';

const createFeedbackZodSchema = z.object({
  body: z.object({
    tenantId: z.string({ required_error: 'Tenant id is required' }),
    houseId: z.string({ required_error: 'House id is required' }),
    rating: z.number({ required_error: 'Rating is required' }),
    comment: z.string({ required_error: 'Comment is required' }),
  }),
});
const updateFeedbackZodSchema = z.object({
  body: z.object({
    rating: z.number().optional(),
    comment: z.string().optional(),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
