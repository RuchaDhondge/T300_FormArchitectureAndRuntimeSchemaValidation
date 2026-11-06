import { useFormContext } from 'react-hook-form'
import type { JobApplicationInput } from '../../schemas/jobApplication.schema'

function valueOrDash(value: string) {
  return value || 'Not provided'
}

export function ReviewStep() {
  const { getValues } = useFormContext<JobApplicationInput>()
  const data = getValues()

  return (
    <section aria-labelledby="review-heading">
      <h2 id="review-heading">Review</h2>
      <p>Check your information before submission.</p>

      <h3>Personal details</h3>
      <dl className="review-list">
        <div>
          <dt>Full name</dt>
          <dd>{data.personal.fullName}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{data.personal.email}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{data.personal.phone}</dd>
        </div>
        <div>
          <dt>Date of birth</dt>
          <dd>{data.personal.dateOfBirth}</dd>
        </div>
        <div>
          <dt>Current city</dt>
          <dd>{data.personal.currentCity}</dd>
        </div>
      </dl>

      <h3>Education</h3>
      {data.education.map((qualification, index) => (
        <dl className="review-list" key={`${qualification.degree}-${index}`}>
          <div>
            <dt>Qualification {index + 1}</dt>
            <dd>
              {qualification.degree}, {qualification.institution},{' '}
              {qualification.passingYear} ({qualification.percentage}%)
            </dd>
          </div>
        </dl>
      ))}

      <h3>Experience</h3>
      <dl className="review-list">
        <div>
          <dt>Experience level</dt>
          <dd>
            {data.experience.status === 'fresher' ? 'Fresher' : 'Experienced'}
          </dd>
        </div>
        {data.experience.status === 'fresher' ? (
          <div>
            <dt>Available from</dt>
            <dd>{data.experience.availableFrom}</dd>
          </div>
        ) : (
          <>
            <div>
              <dt>Total experience</dt>
              <dd>{data.experience.totalExperienceYears} years</dd>
            </div>
            <div>
              <dt>Notice period</dt>
              <dd>{data.experience.noticePeriodDays} days</dd>
            </div>
            {data.experience.companies.map((company, index) => (
              <div key={`${company.companyName}-${index}`}>
                <dt>Previous company {index + 1}</dt>
                <dd>
                  {company.companyName}, {company.role} ({company.fromDate} to{' '}
                  {company.toDate})
                </dd>
              </div>
            ))}
          </>
        )}
      </dl>

      <h3>Application details</h3>
      <dl className="review-list">
        <div>
          <dt>Position</dt>
          <dd>{data.application.position}</dd>
        </div>
        <div>
          <dt>Expected joining date</dt>
          <dd>{data.application.expectedJoiningDate}</dd>
        </div>
        <div>
          <dt>Portfolio</dt>
          <dd>{valueOrDash(data.application.portfolioUrl)}</dd>
        </div>
        <div>
          <dt>Cover note</dt>
          <dd>{valueOrDash(data.application.coverNote)}</dd>
        </div>
      </dl>
    </section>
  )
}
