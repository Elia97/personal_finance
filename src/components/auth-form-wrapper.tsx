"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SignIn from "./signin";
import SignUp from "./signup";

export default function AuthFormWrapper() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");
  const t = useTranslations("app.public.auth.signIn.form");

  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case "CredentialsSignin":
          setError(t("oauth.errors.invalidCredentials"));
          break;
        case "OAuthAccountNotLinked":
          setError(t("oauth.errors.accountNotLinked"));
          break;
        case "OAuthCallback":
          setError(t("oauth.errors.oauthError"));
          break;
        default:
          setError(t("oauth.errors.generic"));
      }
    }
  }, [urlError, t]);

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setError("");
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError(t("oauth.errors.oauthSignIn"));
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-3">
      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* OAuth Providers */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full font-medium hover:bg-zinc-50 transition-colors"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading}
        >
          <span className="mr-2 flex items-center">
            <Image src="/google.svg" alt="Google Logo" width={20} height={20} />
          </span>
          {t("oauth.google")}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">
            {t("oauth.or")}
          </span>
        </div>
      </div>

      {/* Form Credentials */}
      {isNewUser ? <SignUp /> : <SignIn />}

      <div className="text-center text-sm text-zinc-600">
        {isNewUser ? (
          <>
            {t("switch.alreadyAccount")}
            <Button
              variant="link"
              className="px-0 text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setIsNewUser(false)}
              disabled={isLoading}
            >
              {t("switch.signIn")}
            </Button>
          </>
        ) : (
          <>
            {t("switch.noAccount")}
            <Button
              variant="link"
              className="px-0 text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setIsNewUser(true)}
              disabled={isLoading}
            >
              {t("switch.signUp")}
            </Button>
          </>
        )}
      </div>
    </CardContent>
  );
}
