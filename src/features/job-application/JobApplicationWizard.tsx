import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
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
  const methods = useForm<JobApplicationInput, unknown, JobApplication>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues,
    mode: 'onTouched',
    shouldFocusError: true,
  })
  const { clearErrors, trigger } = methods
  const Step = steps[currentStep]
  const isReview = currentStep === steps.length - 1

  const nextStep = async () => {
    const isValid = await trigger([...stepFields[currentStep]], {
      shouldFocus: true,
    })

    if (isValid) {
      setCurrentStep((step) => step + 1)
    }
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
        <form noValidate>
          <Step />

          <div className="actions">
            {currentStep > 0 && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  clearErrors()
                  setCurrentStep((step) => step - 1)
                }}
              >
                Back
              </button>
            )}
            {isReview ? (
              <button type="button" disabled>
                Submit application
              </button>
            ) : (
              <button type="button" onClick={nextStep}>
                Continue
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </main>
  )
}
