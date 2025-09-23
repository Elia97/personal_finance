"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Label } from "./ui/label";
import { forgotPasswordAction } from "@/app/actions/auth-actions";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("app.public.auth.forgotPassword.form");

  const handleAction = async (formData: FormData) => {
    setLoading(true);

    const result = await forgotPasswordAction(formData);

    if (result.success) {
      toast.success(t("success"));
    } else {
      toast.error(result?.error as string);
    }
    setLoading(false);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <Label htmlFor="email" className="hidden" aria-hidden="true">
        {t("email.label")}
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder={t("email.placeholder")}
        required
      />
      <div className="gap-4 grid grid-cols-2">
        <Button
          type="button"
          onClick={() => router.push("/auth/signin")}
          variant="secondary"
        >
          {t("goToSignIn")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t("pending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
