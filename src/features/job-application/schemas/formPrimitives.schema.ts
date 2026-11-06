import { z } from 'zod'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isValidIsoDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export const dateFieldSchema = z
  .string()
  .min(1, { error: 'Select a date' })
  .refine(isValidIsoDate, { error: 'Enter a valid date' })

export function numberFieldSchema(requiredMessage: string) {
  return z
    .string()
    .trim()
    .min(1, { error: requiredMessage })
    .refine((value) => Number.isFinite(Number(value)), {
      error: 'Enter a valid number',
    })
    .transform(Number)
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
