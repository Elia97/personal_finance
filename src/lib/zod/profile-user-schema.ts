import { z } from "zod";

export const ProfileUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
  phone: z.string().min(8).max(15).optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  country: z
    .string()
    .length(2)
    .optional()
    .refine(
      (val) => {
        const countries = ["US", "IT", "GB", "DE", "FR"];
        return countries.includes(val ?? "");
      },
      {
        message: "Invalid country code",
      },
    ),
  language: z
    .string()
    .length(2)
    .optional()
    .refine(
      (val) => {
        const languages = ["en", "it", "fr", "de", "es"];
        return languages.includes(val ?? "");
      },
      {
        message: "Invalid language code",
      },
    ),
  settings: z
    .object({
      twoFactorEnabled: z.boolean(),
      notifications: z.boolean(),
      marketingEmail: z.boolean(),
    })
    .optional(),
});

export type ProfileUser = z.infer<typeof ProfileUserSchema>;
