"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { SignInFormValues, SignInSchema } from "@/lib/zod/signin-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

export default function SignIn(): React.JSX.Element {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { rememberMe: false },
  });

  const t = useTranslations("auth");

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        redirect: false,
      });
      if (result?.error) {
        setError(t("error.invalidCredentials"));
      } else if (result?.ok) {
        const session = await getSession();
        if (session?.user?.status !== "ACTIVE") {
          setError(t("error.inactiveAccount"));
          return;
        }

        router.push(callbackUrl);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {t("login.email")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("placeholder.email")}
          className=""
          {...register("email")}
        />
        {errors.email && (
          <span className="text-destructive text-xs">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {t("login.password")}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={t("placeholder.password")}
          className=" pr-10"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-destructive text-xs">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
          <Label htmlFor="rememberMe" className="text-sm text-slate-600">
            {t("login.rememberMe")}
          </Label>
        </div>
        <Button
          variant="link"
          type="button"
          className="px-0 text-sm text-blue-600 hover:text-blue-800"
          onClick={() => router.push("/auth/forgot-password")}
          disabled={isLoading}
        >
          {t("login.forgotPassword")}
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-tr from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("login.signingIn")}
          </>
        ) : (
          t("login.signIn")
        )}
      </Button>
    </form>
  );
}
