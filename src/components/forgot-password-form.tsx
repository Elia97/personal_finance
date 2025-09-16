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
  const t = useTranslations("auth");

  const handleAction = async (formData: FormData) => {
    setLoading(true);

    const result = await forgotPasswordAction(formData);

    if (result.success) {
      toast.success(t("forgotPassword.success"));
    } else {
      toast.error(result.error || t("forgotPassword.serverError"));
    }
    setLoading(false);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <Label htmlFor="email" className="hidden" aria-hidden="true">
        {t("forgotPassword.email")}
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder={t("placeholder.email")}
        required
      />
      <div className="gap-4 grid grid-cols-2">
        <Button
          type="button"
          onClick={() => router.push("/auth/signin")}
          variant="secondary"
        >
          {t("forgotPassword.backToSignIn")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t("forgotPassword.sending") : t("forgotPassword.submit")}
        </Button>
      </div>
    </form>
  );
}
