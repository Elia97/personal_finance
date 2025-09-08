"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CardAction, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

export default function ResendEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const t = useTranslations("auth.verifyRequest");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    setResendSuccess(false);
    setResendError("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t("error"));
      }
      setResendSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResendError(err.message || t("error"));
      } else {
        setResendError(t("error"));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <CardContent className="space-y-6 pt-6">
      {resendError && (
        <Alert variant="destructive">
          <AlertDescription>{resendError}</AlertDescription>
        </Alert>
      )}
      {resendSuccess && (
        <Alert variant="default">
          <AlertDescription>{t("resendSuccess")}</AlertDescription>
        </Alert>
      )}
      <CardAction className="text-center mx-auto">
        <Button
          onClick={handleResendEmail}
          className="w-full"
          disabled={loading}
        >
          {loading ? t("submitting") : t("submit")}
        </Button>
        <Button onClick={() => router.push("/auth/signin")} variant="link">
          {t("backToLogin")}
        </Button>
      </CardAction>
    </CardContent>
  );
}
