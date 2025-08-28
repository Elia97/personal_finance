"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, TrendingUp, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SignIn from "./signin";
import SignUp from "./signup";

export default function AuthForm() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");
  const t = useTranslations("auth");

  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case "CredentialsSignin":
          setError(t("error.invalidCredentials"));
          break;
        case "OAuthAccountNotLinked":
          setError(t("error.accountNotLinked"));
          break;
        case "OAuthCallback":
          setError(t("error.oauthError"));
          break;
        default:
          setError(t("error.generic"));
      }
    }
  }, [urlError, t]);

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setError("");
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError(`Error during authentication with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardContent className="space-y-6">
        {error && (
          <Alert
            variant="destructive"
            className="animate-in slide-in-from-top-2"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Providers */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 font-medium hover:bg-zinc-50 transition-colors"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
          >
            <span className="mr-2 flex items-center">
              <Image
                src="/google.svg"
                alt="Google Logo"
                width={20}
                height={20}
              />
            </span>
            {t("oauth.continueWithGoogle")}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-zinc-500 font-medium">
              {t("oauth.or")}
            </span>
          </div>
        </div>

        {/* Form Credentials */}
        {isNewUser ? <SignUp /> : <SignIn />}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-6">
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
                {t("switch.signInHere")}
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
                {t("switch.signUpHere")}
              </Button>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-zinc-600">{t("features.security")}</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-zinc-600">{t("features.analytics")}</p>
          </div>
          <div className="text-center">
            <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-zinc-600">{t("features.management")}</p>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
