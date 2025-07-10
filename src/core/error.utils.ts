interface ValidationError {
  field?: string;
  message?: string;
  status?: string | number;
  detail?: string;
}

export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
