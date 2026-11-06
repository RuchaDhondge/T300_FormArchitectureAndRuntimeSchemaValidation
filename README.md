# Job Application Wizard

A five-step job application form built with React, strict TypeScript, React
Hook Form, and Zod. The implementation focuses on form architecture, runtime
validation, accessibility, and predictable submission handling rather than
visual styling.

## Run the project

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Required checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Form structure

Feature code is organized under `src/features/job-application`:

```text
components/steps/              Five form-step components
schemas/                       Composed Zod schemas
services/submitJobApplication  Deterministic mock API
defaultValues.ts               Complete form defaults
stepFields.ts                  Fields validated before each step advances
JobApplicationWizard.tsx       Form instance, navigation, and submission
```

Reusable controls live in `src/components/form`. Each control registers itself
through `useFormContext`, renders its own label and error message, and applies
the same accessibility attributes.

## Schema organization

The schema is the single source of truth:

- `personalDetails.schema.ts` owns contact and identity rules.
- `education.schema.ts` owns qualification and percentage rules.
- `experience.schema.ts` owns the fresher/experienced discriminated union and
  previous-company date ranges.
- `applicationDetails.schema.ts` owns role, joining, portfolio, note, and terms
  rules.
- `jobApplication.schema.ts` composes the sections and applies rules involving
  values from multiple sections.

`JobApplicationInput` and `JobApplication` are inferred from the final schema
with `z.input` and `z.output`. Numeric form values start as HTML strings and
are transformed by Zod, so components do not duplicate parsing or validation.

Cross-value rules include:

- The candidate must be at least 18 on the current date.
- A qualification year must be plausible for the candidate's date of birth.
- A previous company's `to` date must follow its `from` date.
- A fresher's joining date cannot precede their availability date.
- An experienced candidate's joining date must allow for their notice period.
- Joining and previous-employment dates are checked against the current date.

## Validation mode

The form uses `mode: "onTouched"`. A user is not shown an error before they
have interacted with a field, but receives updated feedback after the first
blur. Before moving forward, `trigger()` validates only the current step.
`handleSubmit()` validates the complete composed schema before submission.

## Form-state ownership

One `useForm` instance in `JobApplicationWizard` owns every form value. It is
shared with all steps through `FormProvider`; nested controls access it through
`useFormContext`.

The current step number and the final success reference are local UI state.
Form values are not copied into Redux, Zustand, or another Context. Because
the same form instance remains mounted, values are preserved when navigating
backward.

Education and previous companies use `useFieldArray` and render rows with
`field.id` keys. Fresher and experienced values are modeled as a Zod
discriminated union on `experience.status`.

## Avoiding unnecessary re-renders

- Native fields use React Hook Form's uncontrolled `register` API.
- Experience status is read with `useWatch` only inside the small components
  that need to switch conditional fields.
- The review step calls `getValues()` when mounted rather than subscribing to
  every form value.
- Step navigation validates a typed subset of field paths rather than
  repeatedly validating unrelated steps.

## Accessibility

- Every control has a linked label.
- Invalid controls use `aria-invalid`.
- Error messages are linked through `aria-describedby`.
- Errors are announced with `role="alert"`.
- `trigger(..., { shouldFocus: true })` moves focus to the first invalid field
  when step validation fails.
- Server field errors return the user to the relevant step and move focus to
  the rejected field.
- All interactive controls use native keyboard behavior.

## Mock API outcomes

The mock service waits approximately 1.5 seconds before returning:

| Email | Result |
|---|---|
| `validation@example.com` | Field-level server validation error on email |
| `failure@example.com` | Form-level server failure; entered data is retained |
| Any other valid email | Successful submission with an application reference |

The submit button is disabled while the request is pending to prevent duplicate
submissions.

## Detailed manual verification

### 1. Client validation and focus

1. Run `npm run dev`.
2. Select **Continue** without entering personal details.
3. Confirm the step does not advance.
4. Confirm each invalid input has an error message.
5. Confirm keyboard focus moves to **Full name**.
6. Correct one field and confirm its feedback updates after interaction.

### 2. Education field array

1. Complete personal details and advance.
2. Select **Add qualification** twice.
3. Enter different values in each row.
4. Remove the first row.
5. Confirm the remaining values stay with the correct row.
6. Confirm the final remaining row cannot be removed.
7. Enter a future passing year and confirm the row receives the error.

### 3. Conditional experience fields

1. Advance to Experience and switch between **Fresher** and **Experienced**.
2. Confirm only the fields belonging to the selected option are visible.
3. As a fresher, choose an availability date after the joining date and
   confirm validation prevents completion.
4. As an experienced candidate, add two previous companies.
5. Give one company a `to` date before its `from` date.
6. Confirm the error appears on that company's **To** field.
7. Remove one company and confirm errors remain associated with the right row.

### 4. Navigation and review

1. Complete all four data-entry steps.
2. From Review, navigate backward through multiple steps.
3. Confirm all previously entered values remain available.
4. Change a value and return to Review.
5. Confirm the read-only summary displays the updated value.

### 5. Server validation failure

1. Submit a valid application using `validation@example.com`.
2. Confirm the button displays **Submitting…** for about 1.5 seconds.
3. Confirm the wizard returns to Personal details.
4. Confirm email receives focus and displays the server validation message.
5. Capture a screenshot for the assignment evidence.

### 6. Server failure and retry

1. Submit a valid application using `failure@example.com`.
2. Confirm a form-level server message appears on Review.
3. Confirm all entered data remains visible.
4. Navigate back, replace the email with another valid address, and resubmit.
5. Confirm the retry can complete successfully.
6. Capture a screenshot of the server failure.

### 7. Successful submission

1. Submit with any other valid email.
2. Confirm duplicate submission is prevented while the request is pending.
3. Confirm the success screen displays an `APP-` reference.
4. Select **Start another application**.
5. Confirm the wizard returns to step one with default values.
6. Capture a screenshot of the success state.

### 8. Keyboard and browser checks

1. Complete the entire form using Tab, Shift+Tab, arrow keys, Space, and Enter.
2. Confirm every interactive control has a visible focus indicator.
3. Keep the browser console open throughout all scenarios.
4. Confirm there are no React warnings or uncaught errors.
5. Run the required lint, typecheck, and build commands once more.

## Incomplete work

Manual browser verification and the required flow screenshots must be completed
before opening the pull request.
