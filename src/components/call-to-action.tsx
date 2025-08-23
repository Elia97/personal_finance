"use client";

import { Link } from "@/i18n/navigation";
import { Link as ScrollLink } from "react-scroll";
import { useTranslations } from "next-intl";

export default function CallToAction() {
  const t = useTranslations("home");
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        href="/dashboard"
        aria-label="Go to the dashboard to get started"
        className="px-8 py-2 text-lg rounded-lg border-2 border-primary font-semibold bg-gradient-to-b from-primary to-primary hover:from-primary hover:to-secondary text-blue-100 hover:text-white shadow-2xl hover:shadow-accent transition-all duration-300"
      >
        {t("getStarted")}
      </Link>
      <ScrollLink
        to="features"
        smooth={true}
        duration={500}
        role="link"
        tabIndex={0}
        aria-label="Discover the features of the application"
        className="px-8 py-2 cursor-pointer text-lg rounded-lg text-secondary hover:text-secondary-foreground hover:bg-secondary font-semibold bg-transparent border-2 border-secondary shadow-2xl hover:shadow-accent transition-all duration-300"
      >
        {t("discoverFeatures")}
      </ScrollLink>
    </div>
  );
}
