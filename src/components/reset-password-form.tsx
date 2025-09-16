"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { resetPasswordAction } from "@/app/actions/auth-actions";
import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const t = useTranslations("auth");

  const handleAction = async (formData: FormData) => {
    setError("");
    setLoading(true);

    if (!token) {
      setError(t("resetPassword.token.invalid"));
      setLoading(false);
      return;
    }

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.passwords.mismatch"));
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError(t("resetPassword.passwords.short"));
      setLoading(false);
      return;
    }

    formData.append("token", token);

    try {
      const result = await resetPasswordAction(formData);
      if (result.success) {
        toast.success(t("resetPassword.success"));
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        toast.error(result.error || t("resetPassword.serverError"));
      }
    } catch {
      toast.error(t("resetPassword.serverError"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-destructive">{t("resetPassword.token.missing")}</p>
        <Button
          type="button"
          onClick={() => router.push("/auth/forgot-password")}
          className="w-full mt-2"
        >
          {t("resetPassword.requestNew")}
        </Button>
      </div>
    );
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <Label htmlFor="newPassword" className="mb-2">
          {t("resetPassword.newPassword")}
        </Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder={t("placeholder.password")}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="mb-2">
          {t("resetPassword.confirmPassword")}
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder={t("placeholder.password")}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={loading || !token} className="w-full">
        {loading ? t("resetPassword.resetting") : t("resetPassword.submit")}
      </Button>
    </form>
  );
}
