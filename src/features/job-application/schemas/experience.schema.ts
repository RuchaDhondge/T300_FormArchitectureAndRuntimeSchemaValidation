import { z } from 'zod'
import {
  dateFieldSchema,
  numberFieldSchema,
} from './formPrimitives.schema'

export const previousCompanySchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, { error: 'Enter the company name' })
      .max(100, { error: 'Enter no more than 100 characters' }),
    role: z
      .string()
      .trim()
      .min(2, { error: 'Enter the role' })
      .max(100, { error: 'Enter no more than 100 characters' }),
    fromDate: dateFieldSchema,
    toDate: dateFieldSchema,
  })
  .refine((company) => company.toDate > company.fromDate, {
    error: 'To date must be after from date',
    path: ['toDate'],
  })

export const experienceSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('fresher'),
    availableFrom: dateFieldSchema,
  }),
  z.object({
    status: z.literal('experienced'),
    totalExperienceYears: numberFieldSchema('Enter total experience').pipe(
      z
        .number()
        .min(0.1, { error: 'Experience must be greater than 0' })
        .max(50, { error: 'Experience cannot exceed 50 years' }),
    ),
    noticePeriodDays: numberFieldSchema('Select a notice period').pipe(
      z.number().int().min(0).max(180),
    ),
    companies: z
      .array(previousCompanySchema)
      .min(1, { error: 'Add at least one previous company' })
      .max(15, { error: 'Add no more than 15 previous companies' }),
  }),
])
