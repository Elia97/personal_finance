"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const t = useTranslations("auth");

  useEffect(() => {
    if (!token) {
      setError(t("resetPassword.token.missing"));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError(t("resetPassword.token.invalid"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.passwords.mismatch"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("resetPassword.passwords.short"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(t("resetPassword.success"));
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        setError(data.error || t("resetPassword.error"));
      }
    } catch {
      setError(t("resetPassword.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-destructive">{t("resetPassword.token.missing")}</p>
        <Button
          type="button"
          onClick={() => router.push("/auth/forgot-password")}
          className="w-full mt-2"
        >
          {t("resetPassword.requestNew")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newPassword" className="mb-2">
          {t("resetPassword.newPassword")}
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          placeholder={t("placeholder.password")}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="mb-2">
          {t("resetPassword.confirmPassword")}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder={t("placeholder.password")}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={loading || !token}
        className="w-full"
      >
        {loading ? t("resetPassword.resetting") : t("resetPassword.submit")}
      </Button>
    </form>
  );
}
