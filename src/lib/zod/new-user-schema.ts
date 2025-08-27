import { z } from "zod";

// Definizione dello schema di validazione per il form
export const newUserSchema = z.object({
  phone: z
    .string()
    .min(8, "Il numero di telefono deve avere almeno 8 caratteri")
    .max(15, "Il numero di telefono deve avere al massimo 15 caratteri")
    .optional()
    .or(z.literal("")),
  language: z
    .string()
    .length(2, "La lingua deve avere esattamente 2 caratteri")
    .transform((val) => val.toLowerCase()),
  country: z
    .string()
    .length(2, "Il paese deve avere esattamente 2 caratteri")
    .transform((val) => val.toUpperCase()),
  dateOfBirth: z
    .date()
    .min(
      new Date("1900-01-01"),
      "La data di nascita deve essere dopo il 1 gennaio 1900"
    )
    .max(new Date(), "La data di nascita deve essere nel passato")
    .optional(),
});

export type NewUserFormValues = z.infer<typeof newUserSchema>;
