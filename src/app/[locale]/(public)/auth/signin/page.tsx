import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/auth-form";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("signin");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SignInPage() {
  const t = await getTranslations("signin");
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
      <Card className="shadow-2xl border-slate-200/20 bg-white/95 backdrop-blur-sm w-full max-w-xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center font-semibold">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <AuthForm />
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-slate-400 text-sm">
        <p>{t("footerDescription")}</p>
        <p className="mt-1">
          <Button
            variant="link"
            className="px-0 text-slate-400 hover:text-white text-sm"
          >
            {t("privacyPolicy")}
          </Button>
          {" • "}
          <Button
            variant="link"
            className="px-0 text-slate-400 hover:text-white text-sm"
          >
            {t("termsOfService")}
          </Button>
        </p>
      </div>
    </section>
  );
}
