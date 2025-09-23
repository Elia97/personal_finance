"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const t = useTranslations("app.public.auth.errorPage");
  return error ?? t("description");
}
