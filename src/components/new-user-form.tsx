"use client";

import { useForm } from "react-hook-form";
import { NewUserFormValues, newUserSchema } from "@/lib/zod/new-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function NewUserForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.newUser");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
  });

  const onSubmit = async (data: NewUserFormValues) => {
    setLoading(true);
    if (isDirty) {
      try {
        const res = await fetch("/api/user/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          throw new Error(t("formError"));
        }
        setTimeout(
          () => router.push("/dashboard", { locale: data.language }),
          1500,
        );
      } catch {
        console.error(t("formError"));
      }
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="language" className="mb-2">
          {t("language.label")}
        </Label>
        <Input
          id="language"
          type="text"
          {...register("language")}
          placeholder={t("language.placeholder")}
        />
        {errors.language && (
          <p className="text-xs text-destructive mt-1">
            {errors.language.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="country" className="mb-2">
          {t("country.label")}
        </Label>
        <Input
          id="country"
          type="text"
          {...register("country")}
          placeholder={t("country.placeholder")}
        />
        {errors.country && (
          <p className="text-xs text-destructive mt-1">
            {errors.country.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
