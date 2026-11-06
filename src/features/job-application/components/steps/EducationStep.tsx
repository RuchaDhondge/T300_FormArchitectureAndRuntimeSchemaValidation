import { useFieldArray, useFormContext } from 'react-hook-form'
import { TextField } from '../../../../components/form'
import { emptyQualification } from '../../defaultValues'
import type { JobApplicationInput } from '../../schemas/jobApplication.schema'

export function EducationStep() {
  const { control } = useFormContext<JobApplicationInput>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  return (
    <section aria-labelledby="education-heading">
      <h2 id="education-heading">Education</h2>
      <p>Add at least one qualification.</p>

      {fields.map((field, index) => (
        <fieldset key={field.id} className="array-row">
          <legend>Qualification {index + 1}</legend>
          <TextField<JobApplicationInput>
            name={`education.${index}.degree`}
            label="Degree"
          />
          <TextField<JobApplicationInput>
            name={`education.${index}.institution`}
            label="Institution"
          />
          <TextField<JobApplicationInput>
            name={`education.${index}.passingYear`}
            label="Year of passing"
            type="number"
            min="1950"
            inputMode="numeric"
          />
          <TextField<JobApplicationInput>
            name={`education.${index}.percentage`}
            label="Percentage"
            type="number"
            min="0"
            max="100"
            step="0.01"
          />
          <button
            type="button"
            className="secondary"
            disabled={fields.length === 1}
            onClick={() => remove(index)}
          >
            Remove qualification {index + 1}
          </button>
        </fieldset>
      ))}

      <button
        type="button"
        className="secondary"
        onClick={() => append({ ...emptyQualification })}
      >
        Add qualification
      </button>
    </section>
  )
}
