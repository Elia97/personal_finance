"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { onBoardingAction } from "@/app/actions/user-actions";

export default function NewUserForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.newUser");

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    const result = await onBoardingAction(formData);
    if (result.error) {
      console.error(result.error);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <Label htmlFor="language" className="mb-2">
          {t("language.label")}
        </Label>
        <Input
          id="language"
          name="language"
          type="text"
          placeholder={t("language.placeholder")}
          required
        />
      </div>
      <div>
        <Label htmlFor="country" className="mb-2">
          {t("country.label")}
        </Label>
        <Input
          id="country"
          name="country"
          type="text"
          placeholder={t("country.placeholder")}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
