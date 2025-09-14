"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Label } from "./ui/label";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || t("forgotPassword.serverError"));
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t("forgotPassword.serverError"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="email" className="hidden" aria-hidden="true">
        {t("forgotPassword.email")}
      </Label>
      <Input
        id="email"
        type="email"
        placeholder={t("placeholder.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
      <div className="gap-4 grid grid-cols-2">
        <Button
          type="button"
          onClick={() => router.push("/auth/signin")}
          variant="secondary"
        >
          {t("forgotPassword.backToSignIn")}
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? t("forgotPassword.sending") : t("forgotPassword.submit")}
        </Button>
      </div>
    </form>
  );
}
