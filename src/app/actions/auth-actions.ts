"use server";

import { getAuthSession } from "@/lib/auth-utils";
import { AuthService, handleAuthServiceError } from "@/lib/services/auth";

export async function signUpAction(formData: FormData) {
  try {
    const { name, email, password } = Object.fromEntries(
      formData.entries(),
    ) as {
      name: string;
      email: string;
      password: string;
    };

    await AuthService.signUp({ name, email, password });
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: handleAuthServiceError(error, "Errore durante la registrazione"),
    };
  }
}

export async function forgotPasswordAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;

    await AuthService.forgotPassword(email);
    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      error: handleAuthServiceError(
        error,
        "Errore nell'invio dell'email di reset",
      ),
    };
  }
}

export async function resetPasswordAction(formData: FormData) {
  try {
    const { token, newPassword } = Object.fromEntries(formData.entries()) as {
      token: string;
      newPassword: string;
    };

    await AuthService.resetPassword({ token, newPassword });
    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      error: handleAuthServiceError(error, "Errore nel reset della password"),
    };
  }
}

export async function changePasswordAction(formData: FormData) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return { error: "Utente non autenticato" };
    }

    const { oldPassword, newPassword } = Object.fromEntries(
      formData.entries(),
    ) as {
      oldPassword: string;
      newPassword: string;
    };

    await AuthService.changePassword({
      userId: session.user.id,
      oldPassword,
      newPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      error: handleAuthServiceError(error, "Errore nel cambio della password"),
    };
  }
}
