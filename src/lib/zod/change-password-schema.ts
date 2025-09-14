import { z } from "zod";

export const changePasswordSchema = z
  .object({
    "old-password": z
      .string()
      .min(1, { message: "Current password must not be empty" }),
    "new-password": z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" }),
    "confirm-password": z
      .string()
      .min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data["new-password"] === data["confirm-password"], {
    message: "New password and confirmation do not match",
    path: ["confirm-password"],
  })
  .refine((data) => data["old-password"] !== data["new-password"], {
    message: "New password must be different from the current password",
    path: ["new-password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
