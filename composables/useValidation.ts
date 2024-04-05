// Import necessary libraries
import { type ZodTypeAny, z } from 'zod'
// We use `get` and `groupBy` from `lodash` for brevity

export default function <T extends ZodTypeAny>(schema: T, data: MaybeRefOrGetter<Record<string, unknown>>, options?: { mode: 'eager' | 'lazy' }) {
  // Merge default options with user-defined options
  const opts = Object.assign({}, { mode: 'lazy' }, options)

  // Reactive variables to track form validity and errors
  const isValid = ref(true)
  const errors = ref<Record<string, z.ZodIssue[]> | null>(null)

  // Function to clear errors
  const clearErrors = () => {
    errors.value = null
  }

  // Function to initiate validation watch
  let unwatch: null | (() => void) = null
  const validationWatch = () => {
    if (unwatch !== null) {
      return
    }

    unwatch = watch(
      () => toValue(data),
      async () => {
        await validate()
      },
      { deep: true }
    )
  }

  // Function to perform validation
  const validate = async () => {
    clearErrors()

    // Validate the form data using Zod schema
    const result = await schema.safeParseAsync(toValue(data))

    // Update validity and errors based on validation result
    isValid.value = result.success

    if (!result.success) {
      errors.value = _groupBy(result.error.issues, 'path')
      validationWatch()
    }

    return errors
  }

  // Function to get the error message for a specific form field, can be used to get errors for nested objects using dot notation path.
  const getError = (path: string) => _get(errors.value, `${path.replaceAll('.', ',')}.0.message`)

  // Activate validation watch based on the chosen mode
  if (opts.mode === 'eager') {
    validationWatch()
  }

  // Expose functions and variables for external use
  return { validate, errors, isValid, clearErrors, getError }
}
