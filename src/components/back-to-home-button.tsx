"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BackToHomeButton() {
  const router = useRouter();
  const t = useTranslations("dashboard.sidebar.footer");

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => router.push("/")}
      className="relative hover:*:w-[247px] md:hover:*:w-[182px] w-full overflow-hidden md:justify-end"
    >
      <div className="bg-primary rounded-md h-8 w-1/4 flex items-center text-primary-foreground justify-center absolute left-1 top-1 z-10 duration-500">
        <ArrowLeft />
      </div>
      {t("backToHome")}
    </Button>
  );
}
