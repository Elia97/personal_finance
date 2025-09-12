"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export default function ProfileHeader() {
  const t = useTranslations("profile.header");

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("description")}</p>
      </div>
      <Button
        type="button"
        asChild
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        <Link href="/dashboard">{t("backToDashboard")}</Link>
      </Button>
    </div>
  );
}
