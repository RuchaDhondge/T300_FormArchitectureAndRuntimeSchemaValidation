import { TextField } from '../../../../components/form'
import type { JobApplicationInput } from '../../schemas/jobApplication.schema'

export function PersonalDetailsStep() {
  return (
    <section aria-labelledby="personal-heading">
      <h2 id="personal-heading">Personal details</h2>
      <TextField<JobApplicationInput>
        name="personal.fullName"
        label="Full name"
        autoComplete="name"
      />
      <TextField<JobApplicationInput>
        name="personal.email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <TextField<JobApplicationInput>
        name="personal.phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
      />
      <TextField<JobApplicationInput>
        name="personal.dateOfBirth"
        label="Date of birth"
        type="date"
      />
      <TextField<JobApplicationInput>
        name="personal.currentCity"
        label="Current city"
        autoComplete="address-level2"
      />
    </section>
  )
}
