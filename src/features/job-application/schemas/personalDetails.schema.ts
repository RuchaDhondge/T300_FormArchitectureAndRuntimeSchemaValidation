import { z } from 'zod'
import { dateFieldSchema } from './formPrimitives.schema'

const PHONE_PATTERN = /^\+?[1-9]\d{9,14}$/

export const personalDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: 'Enter at least 2 characters' })
    .max(80, { error: 'Enter no more than 80 characters' }),
  email: z.email({ error: 'Enter a valid email address' }),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, {
      error: 'Enter 10 to 15 digits, optionally starting with +',
    }),
  dateOfBirth: dateFieldSchema,
  currentCity: z
    .string()
    .trim()
    .min(2, { error: 'Enter at least 2 characters' })
    .max(80, { error: 'Enter no more than 80 characters' }),
})
