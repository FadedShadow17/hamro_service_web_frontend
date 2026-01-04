import { z } from 'zod';

export const contactSchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message cannot exceed 5000 characters'),
  category: z.enum(['General', 'Booking', 'Payments', 'Technical', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

