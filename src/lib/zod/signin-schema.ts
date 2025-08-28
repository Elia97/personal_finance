import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be at most 100 characters" }),
  password: z
    .string({ message: "Invalid password" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
  rememberMe: z.boolean().default(false).optional(),
});
export type SignInFormValues = z.infer<typeof SignInSchema>;
