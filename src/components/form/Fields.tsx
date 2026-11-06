import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import {
  get,
  useFormContext,
  type FieldError,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import './Fields.css'

type FieldProps<TValues extends FieldValues> = {
  name: FieldPath<TValues>
  label: string
}

function useAccessibleField<TValues extends FieldValues>(
  name: FieldPath<TValues>,
) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TValues>()
  const error = get(errors, name) as FieldError | undefined
  const id = name.replaceAll('.', '-')

  return {
    id,
    errorMessage: error?.message,
    register,
  }
}

function FieldErrorMessage({
  id,
  message,
}: {
  id: string
  message?: string
}) {
  if (!message) {
    return null
  }

  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  )
}

type TextFieldProps<TValues extends FieldValues> = FieldProps<TValues> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name'>

export function TextField<TValues extends FieldValues>({
  name,
  label,
  type = 'text',
  ...inputProps
}: TextFieldProps<TValues>) {
  const { id, errorMessage, register } = useAccessibleField(name)
  const errorId = `${id}-error`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        {...register(name)}
        id={id}
        type={type}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
      />
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  )
}

type SelectFieldProps<TValues extends FieldValues> = FieldProps<TValues> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'name'> & {
    options: ReadonlyArray<{ value: string; label: string }>
  }

export function SelectField<TValues extends FieldValues>({
  name,
  label,
  options,
  ...selectProps
}: SelectFieldProps<TValues>) {
  const { id, errorMessage, register } = useAccessibleField(name)
  const errorId = `${id}-error`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        {...selectProps}
        {...register(name)}
        id={id}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  )
}

type TextAreaFieldProps<TValues extends FieldValues> = FieldProps<TValues> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'name'>

export function TextAreaField<TValues extends FieldValues>({
  name,
  label,
  ...textAreaProps
}: TextAreaFieldProps<TValues>) {
  const { id, errorMessage, register } = useAccessibleField(name)
  const errorId = `${id}-error`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        {...textAreaProps}
        {...register(name)}
        id={id}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
      />
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  )
}

type CheckboxFieldProps<TValues extends FieldValues> = FieldProps<TValues> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'type'>

export function CheckboxField<TValues extends FieldValues>({
  name,
  label,
  ...inputProps
}: CheckboxFieldProps<TValues>) {
  const { id, errorMessage, register } = useAccessibleField(name)
  const errorId = `${id}-error`

  return (
    <div className="field checkbox-field">
      <div>
        <input
          {...inputProps}
          {...register(name)}
          id={id}
          type="checkbox"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? errorId : undefined}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  )
}

type RadioGroupFieldProps<TValues extends FieldValues> = FieldProps<TValues> & {
  options: ReadonlyArray<{ value: string; label: string }>
}

export function RadioGroupField<TValues extends FieldValues>({
  name,
  label,
  options,
}: RadioGroupFieldProps<TValues>) {
  const { id, errorMessage, register } = useAccessibleField(name)
  const errorId = `${id}-error`

  return (
    <fieldset
      className="field radio-field"
      aria-invalid={errorMessage ? true : undefined}
      aria-describedby={errorMessage ? errorId : undefined}
    >
      <legend>{label}</legend>
      <div className="radio-options">
        {options.map((option) => {
          const optionId = `${id}-${option.value}`

          return (
            <label key={option.value} className="radio-option" htmlFor={optionId}>
              <input
                {...register(name)}
                id={optionId}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          )
        })}
      </div>
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </fieldset>
  )
}
