import { z } from 'zod'
import { applicationDetailsSchema } from './applicationDetails.schema'
import { educationSchema } from './education.schema'
import { experienceSchema } from './experience.schema'
import {
  addDays,
  toIsoDate,
} from './formPrimitives.schema'
import { personalDetailsSchema } from './personalDetails.schema'

export const jobApplicationSchema = z
  .object({
    personal: personalDetailsSchema,
    education: educationSchema,
    experience: experienceSchema,
    application: applicationDetailsSchema,
  })
  .superRefine((data, context) => {
    const today = new Date()
    const todayIso = toIsoDate(today)
    const adultCutoff = new Date(today)
    adultCutoff.setFullYear(adultCutoff.getFullYear() - 18)

    if (data.personal.dateOfBirth > toIsoDate(adultCutoff)) {
      context.addIssue({
        code: 'custom',
        message: 'You must be at least 18 years old',
        path: ['personal', 'dateOfBirth'],
      })
    }

    const birthYear = Number(data.personal.dateOfBirth.slice(0, 4))
    data.education.forEach((qualification, index) => {
      if (qualification.passingYear > today.getFullYear()) {
        context.addIssue({
          code: 'custom',
          message: 'Passing year cannot be in the future',
          path: ['education', index, 'passingYear'],
        })
      }

      if (qualification.passingYear < birthYear + 14) {
        context.addIssue({
          code: 'custom',
          message: 'Passing year is inconsistent with the date of birth',
          path: ['education', index, 'passingYear'],
        })
      }
    })

    if (data.application.expectedJoiningDate <= todayIso) {
      context.addIssue({
        code: 'custom',
        message: 'Expected joining date must be in the future',
        path: ['application', 'expectedJoiningDate'],
      })
    }

    if (
      data.experience.status === 'fresher' &&
      data.application.expectedJoiningDate < data.experience.availableFrom
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Joining date cannot be before your availability date',
        path: ['application', 'expectedJoiningDate'],
      })
    }

    if (data.experience.status === 'experienced') {
      const earliestJoiningDate = toIsoDate(
        addDays(today, data.experience.noticePeriodDays),
      )

      if (data.application.expectedJoiningDate < earliestJoiningDate) {
        context.addIssue({
          code: 'custom',
          message: 'Joining date must allow for the selected notice period',
          path: ['application', 'expectedJoiningDate'],
        })
      }

      data.experience.companies.forEach((company, index) => {
        if (company.toDate > todayIso) {
          context.addIssue({
            code: 'custom',
            message: 'Employment end date cannot be in the future',
            path: ['experience', 'companies', index, 'toDate'],
          })
        }
      })
    }
  })

export type JobApplicationInput = z.input<typeof jobApplicationSchema>
export type JobApplication = z.output<typeof jobApplicationSchema>
