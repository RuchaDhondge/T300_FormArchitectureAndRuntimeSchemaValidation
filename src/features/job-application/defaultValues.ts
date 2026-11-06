import type { JobApplicationInput } from './schemas/jobApplication.schema'

export const emptyQualification = {
  degree: '',
  institution: '',
  passingYear: '',
  percentage: '',
}

export const emptyCompany = {
  companyName: '',
  role: '',
  fromDate: '',
  toDate: '',
}

export const defaultValues: JobApplicationInput = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentCity: '',
  },
  education: [{ ...emptyQualification }],
  experience: {
    status: 'fresher',
    availableFrom: '',
  },
  application: {
    position: 'frontend-engineer',
    expectedJoiningDate: '',
    portfolioUrl: '',
    coverNote: '',
    acceptedTerms: false,
  },
}
