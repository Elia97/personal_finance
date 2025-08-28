"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SignUpFormValues, SignUpSchema } from "@/lib/zod/signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      if (res.ok) {
        // Automatic login after signup
        const loginRes = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (loginRes?.ok) {
          router.push("/auth/new-user");
        } else {
          setError(t("error.registrationSuccessButLogin"));
        }
      } else {
        const data = await res.json();
        setError(data.error || t("error.registration"));
      }
    } catch {
      setError(t("error.connection"));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {t("signup.name")}
        </Label>
        <Input
          id="name"
          type="name"
          placeholder={t("placeholder.name")}
          disabled={isLoading}
          className="h-11"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {t("signup.email")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("placeholder.email")}
          disabled={isLoading}
          className="h-11"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {t("signup.password")}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={t("placeholder.password")}
          disabled={isLoading}
          className="h-11"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-repeat" className="text-sm font-medium">
          {t("signup.repeatPassword")}
        </Label>
        <Input
          id="password-repeat"
          type="password"
          placeholder={t("placeholder.password")}
          disabled={isLoading}
          className="h-11"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="accept-terms"
          checked={acceptTerms ?? false}
          onCheckedChange={(checked: boolean) =>
            setValue("acceptTerms", checked === true)
          }
          disabled={isLoading}
        />
        <Label htmlFor="accept-terms" className="text-sm text-slate-600">
          {t("signup.acceptTerms")}
          <a href="/terms" target="_blank" className="underline">
            {t("signup.terms")}
          </a>
        </Label>
        {errors.acceptTerms && (
          <p className="text-destructive text-sm">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
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
