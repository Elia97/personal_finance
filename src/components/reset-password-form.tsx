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
  const t = useTranslations("app.public.auth.resetPassword.form");

  const handleAction = async (formData: FormData) => {
    setError("");
    setLoading(true);

    if (!token) {
      setError(t("tokenInvalid"));
      setLoading(false);
      return;
    }

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError(t("passwordsMismatch"));
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError(t("passwordShort"));
      setLoading(false);
      return;
    }

    formData.append("token", token);

    try {
      const result = await resetPasswordAction(formData);
      if (result.success) {
        toast.success(t("success"));
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        toast.error(result.error as string);
      }
    } catch {
      toast.error(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-destructive">{t("tokenMissing")}</p>
        <Button
          type="button"
          onClick={() => router.push("/auth/forgot-password")}
          className="w-full mt-2"
        >
          {t("requestNew")}
        </Button>
      </div>
    );
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <Label htmlFor="newPassword" className="mb-2">
          {t("newPassword.label")}
        </Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder={t("newPassword.placeholder")}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="mb-2">
          {t("confirmPassword.label")}
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder={t("confirmPassword.placeholder")}
          required
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={loading || !token} className="w-full">
        {loading ? t("pending") : t("submit")}
      </Button>
    </form>
  );
}
