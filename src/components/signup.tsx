"use client";

import { useActionState, startTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SignUpFormValues, SignUpSchema } from "@/lib/zod/signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpAction } from "@/app/actions/auth-actions";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (
      _state: { error?: string; success?: boolean },
      formData: FormData,
    ): Promise<{ error?: string; success?: boolean }> => {
      return await signUpAction(formData);
    },
    {},
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    control,
    getValues,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
  });

  useEffect(() => {
    if (state.error) setError("root.server", { message: state.error });
    if (state.success) {
      const email = getValues("email");
      const password = getValues("password");
      reset();
      signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/auth/new-user",
      });
    }
  }, [state, router, t, reset, setError, getValues]);

  const onSubmit = (data: SignUpFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium flex-wrap">
          {t("signup.name")}
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </Label>
        <Input
          id="name"
          type="name"
          placeholder={t("placeholder.name")}
          disabled={pending}
          className={`${
            errors.name
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("name")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex-wrap">
          {t("signup.email")}
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("placeholder.email")}
          disabled={pending}
          className={`${
            errors.email
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("email")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium flex-wrap">
          {t("signup.password")}
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={t("placeholder.password")}
          disabled={pending}
          className={`${
            errors.password
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("password")}
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password-repeat"
          className="text-sm font-medium flex-wrap"
        >
          {t("signup.repeatPassword")}
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </Label>
        <Input
          id="password-repeat"
          type="password"
          placeholder={t("placeholder.password")}
          disabled={pending}
          className={`${
            errors.confirmPassword
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("confirmPassword")}
        />
      </div>
      <div className="flex flex-col justify-center space-x-2">
        <div className="flex items-center space-x-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="accept-terms"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={pending}
              />
            )}
          />
          <Label
            htmlFor="accept-terms"
            className="text-sm text-slate-600 flex-wrap"
          >
            {t("signup.acceptTerms")}
            <a href="/terms" target="_blank" className="underline">
              {t("signup.terms")}
            </a>
            {errors.acceptTerms && (
              <p className="text-destructive text-xs">
                {errors.acceptTerms.message}
              </p>
            )}
          </Label>
        </div>
      </div>
      {errors.root?.server && (
        <p className="text-destructive text-xs text-center mb-2">
          {errors.root.server.message}
        </p>
      )}
      <Button
        type="submit"
        className="w-full bg-gradient-to-bl from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("signup.registering")}
          </>
        ) : (
          t("signup.signUp")
        )}
      </Button>
    </form>
  );
}
