interface ValidationError {
  field: string;
  message: string;
}

interface ErrorMessagesResponse {
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
