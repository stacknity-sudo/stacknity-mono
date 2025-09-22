import { z } from "zod";

/**
 * Modern validation utilities using Zod
 */

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string,
    public value?: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .max(254, "Email too long");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  );

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
  .min(10, "Phone number too short")
  .max(20, "Phone number too long");

export const urlSchema = z.string().url("Invalid URL format");

export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  )
  .min(1, "Slug is required")
  .max(100, "Slug too long");

// Validation functions
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.issues.map((err) => err.message),
      };
    }
    return { isValid: false, errors: ["Invalid password"] };
  }
};

export const validatePhone = (phone: string): boolean => {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

export const validateUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
};

// Schema creation helpers
export const createValidationSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape);
};

export const createArraySchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.array(itemSchema);
};

export const createOptionalSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.optional();
};

export const createNullableSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.nullable();
};

// Common field validators
export const requiredString = (message?: string) =>
  z.string().min(1, message || "This field is required");

export const optionalString = () => z.string().optional();

export const requiredNumber = (message?: string) =>
  z.number({ message: message || "Must be a valid number" });

export const positiveNumber = (message?: string) =>
  z.number().positive(message || "Must be a positive number");

export const integerNumber = (message?: string) =>
  z.number().int(message || "Must be an integer");

export const booleanField = () => z.boolean();

export const dateField = () => z.date();

export const dateStringField = () =>
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });

// Conditional validation
export const createConditionalSchema = <T extends z.ZodRawShape>(
  condition: (data: unknown) => boolean,
  trueSchema: z.ZodObject<T>,
  falseSchema: z.ZodObject<T>
) => {
  return z.union([trueSchema, falseSchema]).refine((data) => {
    const schema = condition(data) ? trueSchema : falseSchema;
    const result = schema.safeParse(data);
    return result.success;
  });
};

// Custom validators
export const createCustomValidator = <T>(
  validator: (value: T) => boolean,
  message: string
) => {
  return z.any().refine(validator, { message });
};

// File validation
export const fileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().positive("File size must be positive"),
  type: z.string().min(1, "File type is required"),
});

export const createFileSizeValidator = (maxSizeInMB: number) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return z
    .number()
    .max(maxSizeInBytes, `File size must be less than ${maxSizeInMB}MB`);
};

export const createFileTypeValidator = (allowedTypes: string[]) => {
  return z
    .string()
    .refine(
      (type) => allowedTypes.includes(type),
      `File type must be one of: ${allowedTypes.join(", ")}`
    );
};

// Form validation helpers
export const validateFormData = async <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Promise<{ success: boolean; data?: z.infer<T>; errors?: z.ZodError }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};

export const getFormErrors = (error: z.ZodError): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return errors;
};

export const getFirstFormError = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });

  return errors;
};
