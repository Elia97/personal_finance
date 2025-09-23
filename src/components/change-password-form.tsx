"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { changePasswordAction } from "@/app/actions/auth-actions";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/lib/zod/change-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ChangePasswordForm() {
  const t = useTranslations("app.public.auth.changePassword.form");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function handleAction(formData: FormData) {
    setPending(true);
    setError(null);

    const result = await changePasswordAction(formData);

    if (result.success) {
      toast.success(t("success"));
      setTimeout(() => {
        router.back();
      }, 2000);
      reset();
    } else if (result.error) {
      setError(result.error);
      setFormError("root", { message: result.error });
    }
    setPending(false);
  }

  const onSubmit = (data: ChangePasswordFormValues) => {
    const formData = new FormData();
    formData.append("oldPassword", data["old-password"]);
    formData.append("newPassword", data["new-password"]);
    handleAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="current-password" className="hidden" aria-hidden="true">
          {t("currentPassword")}
        </Label>
        <Input
          id="current-password"
          type="password"
          placeholder={t("currentPassword")}
          {...register("old-password")}
        />
        {errors["old-password"] && (
          <p className="text-sm text-red-600">
            {errors["old-password"].message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="new-password" className="hidden" aria-hidden="true">
          {t("newPassword")}
        </Label>
        <Input
          id="new-password"
          type="password"
          placeholder={t("newPassword")}
          {...register("new-password")}
        />
        {errors["new-password"] && (
          <p className="text-sm text-red-600">
            {errors["new-password"].message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="confirm-password" className="hidden" aria-hidden="true">
          {t("confirmNewPassword")}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder={t("confirmNewPassword")}
          {...register("confirm-password")}
        />
        {errors["confirm-password"] && (
          <p className="text-sm text-red-600">
            {errors["confirm-password"].message}
          </p>
        )}
      </div>
      {(errors.root?.message || error) && (
        <p className="text-sm text-center text-red-600">
          {errors.root?.message || error}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          {t("goBack")}
        </Button>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? t("pending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
