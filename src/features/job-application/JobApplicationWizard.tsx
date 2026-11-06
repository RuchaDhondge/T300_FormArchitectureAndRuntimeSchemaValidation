import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormProvider,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import { ApplicationDetailsStep } from './components/steps/ApplicationDetailsStep'
import { EducationStep } from './components/steps/EducationStep'
import { ExperienceStep } from './components/steps/ExperienceStep'
import { PersonalDetailsStep } from './components/steps/PersonalDetailsStep'
import { ReviewStep } from './components/steps/ReviewStep'
import { defaultValues } from './defaultValues'
import {
  jobApplicationSchema,
  type JobApplication,
  type JobApplicationInput,
} from './schemas/jobApplication.schema'
import { submitJobApplication } from './services/submitJobApplication'
import { stepFields, stepNames } from './stepFields'

const steps = [
  PersonalDetailsStep,
  EducationStep,
  ExperienceStep,
  ApplicationDetailsStep,
  ReviewStep,
]

export function JobApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [applicationId, setApplicationId] = useState<string>()
  const methods = useForm<JobApplicationInput, unknown, JobApplication>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues,
    mode: 'onTouched',
    shouldFocusError: true,
  })
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
    setFocus,
    trigger,
  } = methods
  const Step = steps[currentStep]
  const isReview = currentStep === steps.length - 1

  const nextStep = async () => {
    clearErrors('root')
    const isValid = await trigger([...stepFields[currentStep]], {
      shouldFocus: true,
    })

    if (isValid) {
      setCurrentStep((step) => step + 1)
    }
  }

  const onSubmit: SubmitHandler<JobApplication> = async (application) => {
    clearErrors('root')
    const result = await submitJobApplication(application)

    if (result.status === 'validation-error') {
      for (const [field, message] of Object.entries(result.errors)) {
        if (message) {
          setError(field as 'personal.email', { type: 'server', message })
        }
      }

      setCurrentStep(0)
      requestAnimationFrame(() => setFocus('personal.email'))
      return
    }

    if (result.status === 'server-error') {
      setError('root.server', { type: 'server', message: result.message })
      return
    }

    setApplicationId(result.applicationId)
    reset(defaultValues)
  }

  const onInvalid: SubmitErrorHandler<JobApplicationInput> = () => {
    setError('root.validation', {
      type: 'validation',
      message: 'Review the highlighted fields before submitting.',
    })
  }

  if (applicationId) {
    return (
      <main className="form-card" aria-labelledby="success-heading">
        <h1 id="success-heading">Application submitted</h1>
        <p role="status">
          Your application reference is <strong>{applicationId}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setApplicationId(undefined)
            setCurrentStep(0)
          }}
        >
          Start another application
        </button>
      </main>
    )
  }

  return (
    <main className="form-card">
      <header>
        <p className="eyebrow">Careers portal</p>
        <h1>Job application</h1>
        <p>
          Step {currentStep + 1} of {steps.length}: {stepNames[currentStep]}
        </p>
        <progress value={currentStep + 1} max={steps.length}>
          {currentStep + 1} of {steps.length}
        </progress>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
          <Step />

          {errors.root?.server?.message && (
            <p className="form-error" role="alert">
              {errors.root.server.message}
            </p>
          )}
          {errors.root?.validation?.message && (
            <p className="form-error" role="alert">
              {errors.root.validation.message}
            </p>
          )}

          <div className="actions">
            {currentStep > 0 && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  clearErrors('root')
                  setCurrentStep((step) => step - 1)
                }}
              >
                Back
              </button>
            )}
            {isReview ? (
              <button key="submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Submit application'}
              </button>
            ) : (
              <button key="continue" type="button" onClick={nextStep}>
                Continue
              </button>
            )}
          </div>
        </form>
      </FormProvider>

      <aside className="demo-note" aria-label="Mock API test accounts">
        <strong>Mock API scenarios:</strong> use validation@example.com for a
        field error or failure@example.com for a server error.
      </aside>
    </main>
  )
}
