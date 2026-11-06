import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from '../../../../components/form'
import type { JobApplicationInput } from '../../schemas/jobApplication.schema'

export function ApplicationDetailsStep() {
  return (
    <section aria-labelledby="application-heading">
      <h2 id="application-heading">Application details</h2>
      <SelectField<JobApplicationInput>
        name="application.position"
        label="Position applied for"
        options={[
          { value: 'frontend-engineer', label: 'Frontend Engineer' },
          { value: 'backend-engineer', label: 'Backend Engineer' },
          { value: 'full-stack-engineer', label: 'Full Stack Engineer' },
          { value: 'qa-engineer', label: 'QA Engineer' },
        ]}
      />
      <TextField<JobApplicationInput>
        name="application.expectedJoiningDate"
        label="Expected joining date"
        type="date"
      />
      <TextField<JobApplicationInput>
        name="application.portfolioUrl"
        label="Portfolio link (optional)"
        type="url"
        placeholder="https://example.com"
      />
      <TextAreaField<JobApplicationInput>
        name="application.coverNote"
        label="Cover note (optional)"
        rows={6}
        maxLength={1000}
      />
      <CheckboxField<JobApplicationInput>
        name="application.acceptedTerms"
        label="I accept the terms and confirm that this information is accurate"
      />
    </section>
  )
}
