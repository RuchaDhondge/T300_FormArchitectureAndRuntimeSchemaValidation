import { z } from 'zod'
import { numberFieldSchema } from './formPrimitives.schema'

export const qualificationSchema = z.object({
  degree: z
    .string()
    .trim()
    .min(2, { error: 'Enter the degree name' })
    .max(100, { error: 'Enter no more than 100 characters' }),
  institution: z
    .string()
    .trim()
    .min(2, { error: 'Enter the institution name' })
    .max(120, { error: 'Enter no more than 120 characters' }),
  passingYear: numberFieldSchema('Enter the passing year').pipe(
    z
      .number()
      .int({ error: 'Enter a whole year' })
      .min(1950, { error: 'Year must be 1950 or later' }),
  ),
  percentage: numberFieldSchema('Enter the percentage').pipe(
    z
      .number()
      .min(0, { error: 'Percentage cannot be below 0' })
      .max(100, { error: 'Percentage cannot exceed 100' }),
  ),
})

export const educationSchema = z
  .array(qualificationSchema)
  .min(1, { error: 'Add at least one qualification' })
  .max(10, { error: 'Add no more than 10 qualifications' })
