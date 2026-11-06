import type { FieldPath } from 'react-hook-form'
import type { JobApplicationInput } from './schemas/jobApplication.schema'

export const stepFields: ReadonlyArray<
  ReadonlyArray<FieldPath<JobApplicationInput>>
> = [
  [
    'personal.fullName',
    'personal.email',
    'personal.phone',
    'personal.dateOfBirth',
    'personal.currentCity',
  ],
  ['education'],
  ['experience'],
  [
    'application.position',
    'application.expectedJoiningDate',
    'application.portfolioUrl',
    'application.coverNote',
    'application.acceptedTerms',
  ],
  [],
]

export const stepNames = [
  'Personal details',
  'Education',
  'Experience',
  'Application details',
  'Review',
] as const
