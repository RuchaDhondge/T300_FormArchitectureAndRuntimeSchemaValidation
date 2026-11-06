import { useEffect, useRef } from 'react'
import {
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import {
  RadioGroupField,
  SelectField,
  TextField,
} from '../../../../components/form'
import { emptyCompany } from '../../defaultValues'
import type { JobApplicationInput } from '../../schemas/jobApplication.schema'

function ExperienceStatusFields() {
  const { control, setValue } = useFormContext<JobApplicationInput>()
  const status = useWatch({ control, name: 'experience.status' })
  const previousStatus = useRef(status)

  useEffect(() => {
    if (previousStatus.current === status) {
      return
    }

    previousStatus.current = status

    if (status === 'experienced') {
      setValue(
        'experience',
        {
          status: 'experienced',
          totalExperienceYears: '',
          noticePeriodDays: '0',
          companies: [{ ...emptyCompany }],
        },
        { shouldDirty: true },
      )
      return
    }

    setValue(
      'experience',
      {
        status: 'fresher',
        availableFrom: '',
      },
      { shouldDirty: true },
    )
  }, [setValue, status])

  return (
    <>
      <RadioGroupField<JobApplicationInput>
        name="experience.status"
        label="Experience level"
        options={[
          { value: 'fresher', label: 'Fresher' },
          { value: 'experienced', label: 'Experienced' },
        ]}
      />
      <ConditionalExperienceFields />
    </>
  )
}

function PreviousCompanies() {
  const { control } = useFormContext<JobApplicationInput>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience.companies',
  })

  return (
    <>
      {fields.map((field, index) => (
        <fieldset key={field.id} className="array-row">
          <legend>Previous company {index + 1}</legend>
          <TextField<JobApplicationInput>
            name={`experience.companies.${index}.companyName`}
            label="Company name"
          />
          <TextField<JobApplicationInput>
            name={`experience.companies.${index}.role`}
            label="Role"
          />
          <TextField<JobApplicationInput>
            name={`experience.companies.${index}.fromDate`}
            label="From"
            type="date"
          />
          <TextField<JobApplicationInput>
            name={`experience.companies.${index}.toDate`}
            label="To"
            type="date"
          />
          <button
            type="button"
            className="secondary"
            disabled={fields.length === 1}
            onClick={() => remove(index)}
          >
            Remove company {index + 1}
          </button>
        </fieldset>
      ))}

      <button
        type="button"
        className="secondary"
        onClick={() => append({ ...emptyCompany })}
      >
        Add previous company
      </button>
    </>
  )
}

function ConditionalExperienceFields() {
  const { control } = useFormContext<JobApplicationInput>()
  const status = useWatch({ control, name: 'experience.status' })

  if (status === 'experienced') {
    return (
      <>
        <TextField<JobApplicationInput>
          name="experience.totalExperienceYears"
          label="Total experience (years)"
          type="number"
          min="0.1"
          max="50"
          step="0.1"
        />
        <SelectField<JobApplicationInput>
          name="experience.noticePeriodDays"
          label="Notice period"
          options={[
            { value: '0', label: 'Immediate' },
            { value: '15', label: '15 days' },
            { value: '30', label: '30 days' },
            { value: '60', label: '60 days' },
            { value: '90', label: '90 days' },
          ]}
        />
        <PreviousCompanies />
      </>
    )
  }

  return (
    <TextField<JobApplicationInput>
      name="experience.availableFrom"
      label="Available to join from"
      type="date"
    />
  )
}

export function ExperienceStep() {
  return (
    <section aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      <ExperienceStatusFields />
    </section>
  )
}
