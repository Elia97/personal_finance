import {
  findUserById,
  updateUser,
  createUser,
  findUserByEmail,
} from "@/repositories/user-repository";
import type { Prisma } from "@/generated/prisma";
import type { UserProfile, User } from "next-auth";

// Types for user operations
export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string; // ISO string from form
  country?: string;
  language?: string;
  settings?: {
    twoFactorEnabled: boolean;
    notifications: boolean;
    marketingEmail: boolean;
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface OnboardingData {
  country: string;
  language: string;
}

// User Service Class
export class UserService {
  /**
   * Get user by ID with specified fields
   */
  static async getUserById(
    userId: string,
    selectFields?: Prisma.UserSelect,
  ): Promise<Partial<User> | null> {
    try {
      return await findUserById(userId, selectFields);
    } catch (error) {
      console.error("Errore nel caricamento dell'utente:", error);
      throw new Error("Impossibile caricare i dati dell'utente");
    }
  }

  /**
   * Get full user profile with counts
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const user = (await findUserById(userId, {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        language: true,
        country: true,
        dateOfBirth: true,
        lastLogin: true,
        emailVerified: true,
        settings: true,
        createdAt: true,
        _count: {
          select: {
            accounts: true,
            transactions: true,
            goals: true,
            investments: true,
          },
        },
      })) as UserProfile | null;

      if (!user) {
        throw new Error("Utente non trovato");
      }

      return user;
    } catch (error) {
      console.error("Errore nel caricamento del profilo:", error);
      throw error instanceof Error
        ? error
        : new Error("Impossibile caricare il profilo");
    }
  }

  /**
   * Get user locale settings
   */
  static async getUserLocale(userId: string): Promise<Partial<User>> {
    try {
      const user = await findUserById(userId, {
        language: true,
        country: true,
      });

      return {
        language: user?.language || null,
        country: user?.country || null,
      };
    } catch (error) {
      console.error("Errore nel caricamento della locale:", error);
      throw new Error("Impossibile caricare le impostazioni della lingua");
    }
  }

  /**
   * Update user profile with validation
   */
  static async updateProfile(
    userId: string,
    data: UpdateUserProfileData,
  ): Promise<User> {
    try {
      // Validate input data
      const validatedData = this.validateProfileData(data);

      // Check if email is already taken by another user
      if (validatedData.email) {
        const existingUser = await findUserByEmail(validatedData.email);
        if (existingUser && existingUser.id !== userId) {
          throw new Error("Questa email è già utilizzata da un altro utente");
        }
      }

      // Prepare update data for Prisma
      const updateData: Prisma.UserUpdateInput = {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.phone && { phone: validatedData.phone }),
        ...(validatedData.dateOfBirth && {
          dateOfBirth: new Date(validatedData.dateOfBirth),
        }),
        ...(validatedData.country && { country: validatedData.country }),
        ...(validatedData.language && { language: validatedData.language }),
        ...(validatedData.settings && { settings: validatedData.settings }),
      };

      const updatedUser = await updateUser(userId, updateData);

      if (!updatedUser) {
        throw new Error("Errore nell'aggiornamento del profilo");
      }

      return updatedUser;
    } catch (error) {
      console.error("Errore nel servizio di aggiornamento profilo:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'aggiornamento del profilo");
    }
  }

  /**
   * Handle onboarding process
   */
  static async completeOnboarding(
    userId: string,
    data: OnboardingData,
  ): Promise<User> {
    try {
      // Validate onboarding data
      if (!data.country?.trim()) {
        throw new Error("Il paese è obbligatorio");
      }
      if (!data.language?.trim()) {
        throw new Error("La lingua è obbligatoria");
      }

      const updateData: Prisma.UserUpdateInput = {
        country: data.country.trim(),
        language: data.language.trim(),
      };

      const updatedUser = await updateUser(userId, updateData);

      if (!updatedUser) {
        throw new Error("Errore nel completamento dell'onboarding");
      }

      return updatedUser;
    } catch (error) {
      console.error("Errore nell'onboarding:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nel completamento dell'onboarding");
    }
  }

  /**
   * Create new user with validation
   */
  static async createUser(data: CreateUserData): Promise<User> {
    try {
      // Validate input
      if (!data.name?.trim()) {
        throw new Error("Il nome è obbligatorio");
      }
      if (!data.email?.trim()) {
        throw new Error("L'email è obbligatoria");
      }
      if (!this.isValidEmail(data.email)) {
        throw new Error("Formato email non valido");
      }
      if (!data.password || data.password.length < 8) {
        throw new Error("La password deve contenere almeno 8 caratteri");
      }

      // Check if email already exists
      const existingUser = await findUserByEmail(data.email);
      if (existingUser) {
        throw new Error("Un utente con questa email esiste già");
      }

      const newUser = await createUser(
        data.name.trim(),
        data.email.trim().toLowerCase(),
        data.password,
      );

      if (!newUser) {
        throw new Error("Errore nella creazione dell'utente");
      }

      return newUser;
    } catch (error) {
      console.error("Errore nella creazione utente:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nella creazione dell'utente");
    }
  }

  /**
   * Validate profile data with business rules
   */
  private static validateProfileData(
    data: UpdateUserProfileData,
  ): UpdateUserProfileData {
    const validated: UpdateUserProfileData = {};

    // Validate name
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        throw new Error("Il nome non può essere vuoto");
      }
      if (data.name.trim().length < 2) {
        throw new Error("Il nome deve contenere almeno 2 caratteri");
      }
      validated.name = data.name.trim();
    }

    // Validate email
    if (data.email !== undefined) {
      if (!data.email.trim()) {
        throw new Error("L'email non può essere vuota");
      }
      if (!this.isValidEmail(data.email)) {
        throw new Error("Formato email non valido");
      }
      validated.email = data.email.trim().toLowerCase();
    }

    // Validate phone
    if (data.phone !== undefined && data.phone.trim()) {
      if (!this.isValidPhone(data.phone)) {
        throw new Error("Formato telefono non valido");
      }
      validated.phone = data.phone.trim();
    }

    // Validate date of birth
    if (data.dateOfBirth !== undefined && data.dateOfBirth.trim()) {
      const date = new Date(data.dateOfBirth);
      if (isNaN(date.getTime())) {
        throw new Error("Data di nascita non valida");
      }
      if (date > new Date()) {
        throw new Error("La data di nascita non può essere nel futuro");
      }
      const age = new Date().getFullYear() - date.getFullYear();
      if (age < 13) {
        throw new Error("Devi avere almeno 13 anni per usare questa app");
      }
      validated.dateOfBirth = data.dateOfBirth;
    }

    // Validate country and language
    if (data.country !== undefined && data.country.trim()) {
      validated.country = data.country.trim();
    }
    if (data.language !== undefined && data.language.trim()) {
      validated.language = data.language.trim();
    }

    // Settings are already validated as booleans from FormData
    if (data.settings !== undefined) {
      validated.settings = data.settings;
    }

    return validated;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (basic validation)
   */
  private static isValidPhone(phone: string): boolean {
    // Accept international formats, remove spaces/dashes for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(cleanPhone);
  }
}

// Utility per gestire gli errori in modo consistente
export const handleUserServiceError = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
