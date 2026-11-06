import { z } from 'zod'
import { dateFieldSchema } from './formPrimitives.schema'

export const applicationDetailsSchema = z.object({
  position: z.enum(
    ['frontend-engineer', 'backend-engineer', 'full-stack-engineer', 'qa-engineer'],
    { error: 'Select a position' },
  ),
  expectedJoiningDate: dateFieldSchema,
  portfolioUrl: z
    .union([
      z.literal(''),
      z.url({ error: 'Enter a complete URL, including https://' }),
    ])
    .transform((value) => value || undefined),
  coverNote: z
    .string()
    .trim()
    .max(1000, { error: 'Use no more than 1000 characters' })
    .transform((value) => value || undefined),
  acceptedTerms: z.boolean().refine((accepted) => accepted, {
    error: 'Accept the terms to continue',
  }),
})
