import { AppError } from "../../entities/error/slice";

export const errorToAppError = (
  error: unknown,
  defaultMessage: string,
): AppError => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message || defaultMessage,
      stack: error.stack,
    };
  } else {
    return {
      message: typeof error == "object" ? JSON.stringify(error) : `${error}`,
    };
  }
};
