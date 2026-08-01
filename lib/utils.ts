import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isAPIError } from "better-auth/api";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2,'0')}`:`${int}.00`;
}

// Format errors
export function formatError(error: unknown): string {
  // 1. Zod validation errors
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join(". ");
  }

  // 2. BetterAuth API errors
  if (isAPIError(error)) {
    switch (error.body?.code) {
      case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
        return "An account with this email already exists.";
      case "PASSWORD_TOO_SHORT":
        return "Password must be at least 8 characters.";
      case "PASSWORD_TOO_LONG":
        return "Password is too long.";
      case "INVALID_EMAIL_OR_PASSWORD":
        return "Invalid email or password.";
      default:
        return error.message || "Something went wrong. Please try again.";
    }
  }

  // 3. Generic JS errors
  if (error instanceof Error) {
    return error.message;
  }

  // 4. Unknown error shape
  return "An unexpected error occurred. Please try again.";
}