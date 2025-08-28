import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must be at most 100 characters" }),
    email: z
      .email({ message: "Invalid email address" })
      .max(100, { message: "Email must be at most 100 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be at most 100 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
        message:
          "Password must include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be at most 100 characters" }),
    acceptTerms: z
      .boolean()
      .default(false)
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof SignUpSchema>;
