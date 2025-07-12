export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorMessagesResponse {
  errorMessages: ValidationError[];
}

export const createErrorMessages = (
  errors: ValidationError[],
): ErrorMessagesResponse => {
  return {
    errorMessages: errors.map((error) => ({
      field: error.field,
      message: error.message,
    })),
  };
};
