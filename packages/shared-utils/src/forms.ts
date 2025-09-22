/**
 * Form utilities and helpers
 */

import { z } from "zod";

export interface FormField<T = unknown> {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "textarea"
    | "date"
    | "file";
  required: boolean;
  placeholder?: string;
  defaultValue?: T;
  options?: Array<{ label: string; value: T }>;
  validation?: z.ZodSchema<T>;
  helperText?: string;
  disabled?: boolean;
}

export interface FormValidation {
  errors: Record<string, string[]>;
  isValid: boolean;
  touched: Record<string, boolean>;
}

export const createFormSchema = <T extends z.ZodRawShape>(
  fields: Record<keyof T, FormField>
) => {
  const schemaShape: Record<string, z.ZodSchema> = {};

  Object.entries(fields).forEach(([key, field]) => {
    if (field.validation) {
      schemaShape[key] = field.required
        ? field.validation
        : field.validation.optional();
    }
  });

  return z.object(schemaShape);
};

export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  data: Record<string, unknown>
): FormValidation => {
  try {
    schema.parse(data);
    return {
      errors: {},
      isValid: true,
      touched: {},
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });

      return {
        errors,
        isValid: false,
        touched: {},
      };
    }

    return {
      errors: { form: ["Validation failed"] },
      isValid: false,
      touched: {},
    };
  }
};

export const createTextField = (
  name: string,
  label: string,
  options: Partial<FormField<string>> = {}
): FormField<string> => ({
  name,
  label,
  type: "text",
  required: false,
  ...options,
});

export const createEmailField = (
  name: string,
  label: string,
  options: Partial<FormField<string>> = {}
): FormField<string> => ({
  name,
  label,
  type: "email",
  required: true,
  validation: z.string().email("Invalid email format"),
  ...options,
});

export const createPasswordField = (
  name: string,
  label: string,
  options: Partial<FormField<string>> = {}
): FormField<string> => ({
  name,
  label,
  type: "password",
  required: true,
  validation: z.string().min(8, "Password must be at least 8 characters"),
  ...options,
});

export const createNumberField = (
  name: string,
  label: string,
  options: Partial<FormField<number>> = {}
): FormField<number> => ({
  name,
  label,
  type: "number",
  required: false,
  validation: z.number(),
  ...options,
});

export const createSelectField = <T>(
  name: string,
  label: string,
  options: Array<{ label: string; value: T }>,
  fieldOptions: Partial<FormField<T>> = {}
): FormField<T> => ({
  name,
  label,
  type: "select",
  required: false,
  options,
  ...fieldOptions,
});

export const createCheckboxField = (
  name: string,
  label: string,
  options: Partial<FormField<boolean>> = {}
): FormField<boolean> => ({
  name,
  label,
  type: "checkbox",
  required: false,
  validation: z.boolean(),
  defaultValue: false,
  ...options,
});

export const createTextareaField = (
  name: string,
  label: string,
  options: Partial<FormField<string>> = {}
): FormField<string> => ({
  name,
  label,
  type: "textarea",
  required: false,
  ...options,
});

export const createDateField = (
  name: string,
  label: string,
  options: Partial<FormField<Date>> = {}
): FormField<Date> => ({
  name,
  label,
  type: "date",
  required: false,
  validation: z.date(),
  ...options,
});

export const createFileField = (
  name: string,
  label: string,
  options: Partial<FormField<File>> = {}
): FormField<File> => ({
  name,
  label,
  type: "file",
  required: false,
  ...options,
});

// Form state management helpers
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export const createInitialFormState = <T extends Record<string, unknown>>(
  initialValues: T
): FormState<T> => ({
  values: initialValues,
  errors: {},
  touched: {},
  isValid: true,
  isSubmitting: false,
  isDirty: false,
});

export const setFieldValue = <T extends Record<string, unknown>>(
  state: FormState<T>,
  fieldName: keyof T,
  value: T[keyof T]
): FormState<T> => ({
  ...state,
  values: {
    ...state.values,
    [fieldName]: value,
  },
  touched: {
    ...state.touched,
    [fieldName]: true,
  },
  isDirty: true,
});

export const setFieldError = <T>(
  state: FormState<T>,
  fieldName: string,
  error: string | string[]
): FormState<T> => ({
  ...state,
  errors: {
    ...state.errors,
    [fieldName]: Array.isArray(error) ? error : [error],
  },
  isValid: false,
});

export const clearFieldError = <T>(
  state: FormState<T>,
  fieldName: string
): FormState<T> => {
  const newErrors = { ...state.errors };
  delete newErrors[fieldName];

  return {
    ...state,
    errors: newErrors,
    isValid: Object.keys(newErrors).length === 0,
  };
};

export const resetForm = <T extends Record<string, unknown>>(
  initialValues: T
): FormState<T> => createInitialFormState(initialValues);

// Form submission helpers
export const handleFormSubmit = async <T>(
  values: T,
  schema: z.ZodSchema<T>,
  onSubmit: (values: T) => Promise<void>
): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
  try {
    const validatedValues = schema.parse(values);
    await onSubmit(validatedValues);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });

      return { success: false, errors };
    }

    return { success: false, errors: { form: ["Submission failed"] } };
  }
};
