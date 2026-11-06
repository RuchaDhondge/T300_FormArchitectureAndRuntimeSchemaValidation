import type { JobApplication } from '../schemas/jobApplication.schema'

export type SubmissionResult =
  | { status: 'success'; applicationId: string }
  | {
      status: 'validation-error'
      errors: Partial<Record<'personal.email', string>>
    }
  | { status: 'server-error'; message: string }

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })

export async function submitJobApplication(
  application: JobApplication,
): Promise<SubmissionResult> {
  await delay(1500)

  if (application.personal.email === 'validation@example.com') {
    return {
      status: 'validation-error',
      errors: {
        'personal.email': 'An application already exists for this email',
      },
    }
  }

  if (application.personal.email === 'failure@example.com') {
    return {
      status: 'server-error',
      message: 'The application service is temporarily unavailable. Try again.',
    }
  }

  return {
    status: 'success',
    applicationId: `APP-${Date.now().toString().slice(-8)}`,
  }
}
