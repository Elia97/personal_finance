import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUser,
} from "@/repositories/user-repository";
import {
  createVerificationToken,
  deleteVerificationToken,
  findVerificationToken,
} from "@/repositories/auth-repository";
import {
  hashPassword,
  verifyPassword,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/auth-utils";
import { createUserEvent } from "@/lib/auth-events";
import { randomBytes } from "crypto";

// Types for auth operations
export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

// Auth Service Class
export class AuthService {
  /**
   * Handle user registration with validation and verification email
   */
  static async signUp(data: SignUpData): Promise<{ success: boolean }> {
    try {
      // Validate input data
      this.validateSignUpData(data);

      // Check if user already exists
      const existingUser = await findUserByEmail(data.email);
      if (existingUser) {
        throw new Error("Un utente con questa email esiste già");
      }

      // Create new user
      const user = await createUser(
        data.name.trim(),
        data.email.trim().toLowerCase(),
        data.password,
      );

      if (!user?.email) {
        throw new Error("Errore nella creazione dell'utente");
      }

      // Create user event and send verification email
      await createUserEvent({ user });
      await this.sendEmailVerification(user.email);

      return { success: true };
    } catch (error) {
      console.error("Errore nella registrazione:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore durante la registrazione");
    }
  }

  /**
   * Handle forgot password request
   */
  static async forgotPassword(email: string): Promise<{ success: boolean }> {
    try {
      if (!email?.trim()) {
        throw new Error("L'email è obbligatoria");
      }

      if (!this.isValidEmail(email)) {
        throw new Error("Formato email non valido");
      }

      const user = await findUserByEmail(email.trim().toLowerCase());

      // Don't reveal if user exists or not for security
      if (user?.email) {
        await this.sendPasswordResetToken(user.email);
      }

      return { success: true };
    } catch (error) {
      console.error("Errore nel reset password:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'invio dell'email di reset");
    }
  }

  /**
   * Handle password reset with token validation
   */
  static async resetPassword(
    data: ResetPasswordData,
  ): Promise<{ success: boolean }> {
    try {
      this.validateResetPasswordData(data);

      if (!data.token.startsWith("reset_")) {
        throw new Error("Token non valido");
      }

      // Verify token
      const verificationToken = await findVerificationToken(data.token);
      if (!verificationToken || verificationToken.expires < new Date()) {
        throw new Error("Token non valido o scaduto");
      }

      // Find user
      const user = await findUserByEmail(verificationToken.identifier);
      if (!user) {
        throw new Error("Utente non trovato");
      }

      // Update password
      await updateUser(user.id, {
        password: await hashPassword(data.newPassword),
      });

      // Clean up token
      await deleteVerificationToken(data.token);

      return { success: true };
    } catch (error) {
      console.error("Errore nel reset della password:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nel reset della password");
    }
  }

  /**
   * Handle password change for authenticated users
   */
  static async changePassword(
    data: ChangePasswordData,
  ): Promise<{ success: boolean }> {
    try {
      this.validateChangePasswordData(data);

      // Get current user with password
      const user = await findUserById(data.userId, {
        id: true,
        password: true,
      });

      if (!user) {
        throw new Error("Utente non trovato");
      }

      // Verify old password
      const isOldPasswordValid = await verifyPassword(
        data.oldPassword,
        user.password || "",
      );

      if (!isOldPasswordValid) {
        throw new Error("Password attuale non corretta");
      }

      // Update with new password
      await updateUser(user.id, {
        password: await hashPassword(data.newPassword),
      });

      return { success: true };
    } catch (error) {
      console.error("Errore nel cambio password:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nel cambio della password");
    }
  }

  /**
   * Send email verification token
   */
  private static async sendEmailVerification(email: string): Promise<void> {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 604800000); // 7 days

    await createVerificationToken(email, token, expires);
    await sendVerificationEmail(email, token);
  }

  /**
   * Send password reset token
   */
  private static async sendPasswordResetToken(email: string): Promise<void> {
    const resetToken = "reset_" + randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await createVerificationToken(email, resetToken, expires);
    await sendPasswordResetEmail(email, resetToken);
  }

  /**
   * Validate sign up data
   */
  private static validateSignUpData(data: SignUpData): void {
    if (!data.name?.trim()) {
      throw new Error("Il nome è obbligatorio");
    }
    if (data.name.trim().length < 2) {
      throw new Error("Il nome deve contenere almeno 2 caratteri");
    }
    if (!data.email?.trim()) {
      throw new Error("L'email è obbligatoria");
    }
    if (!this.isValidEmail(data.email)) {
      throw new Error("Formato email non valido");
    }
    if (!data.password) {
      throw new Error("La password è obbligatoria");
    }
    if (data.password.length < 8) {
      throw new Error("La password deve contenere almeno 8 caratteri");
    }
    if (!this.hasValidPasswordComplexity(data.password)) {
      throw new Error(
        "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero",
      );
    }
  }

  /**
   * Validate reset password data
   */
  private static validateResetPasswordData(data: ResetPasswordData): void {
    if (!data.token?.trim()) {
      throw new Error("Token obbligatorio");
    }
    if (!data.newPassword) {
      throw new Error("La nuova password è obbligatoria");
    }
    if (data.newPassword.length < 8) {
      throw new Error("La password deve contenere almeno 8 caratteri");
    }
    if (!this.hasValidPasswordComplexity(data.newPassword)) {
      throw new Error(
        "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero",
      );
    }
  }

  /**
   * Validate change password data
   */
  private static validateChangePasswordData(data: ChangePasswordData): void {
    if (!data.userId?.trim()) {
      throw new Error("ID utente obbligatorio");
    }
    if (!data.oldPassword) {
      throw new Error("La password attuale è obbligatoria");
    }
    if (!data.newPassword) {
      throw new Error("La nuova password è obbligatoria");
    }
    if (data.newPassword.length < 8) {
      throw new Error("La password deve contenere almeno 8 caratteri");
    }
    if (data.oldPassword === data.newPassword) {
      throw new Error(
        "La nuova password deve essere diversa da quella attuale",
      );
    }
    if (!this.hasValidPasswordComplexity(data.newPassword)) {
      throw new Error(
        "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero",
      );
    }
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password complexity
   */
  private static hasValidPasswordComplexity(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers;
  }
}

// Utility per gestire gli errori in modo consistente
export const handleAuthServiceError = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
