import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthFormWrapper from "@/components/auth-form-wrapper";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Shield, TrendingUp, CreditCard } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.public.auth.signIn");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SignInPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("app.public.auth.signIn");

  return (
    <div className="py-6">
      <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
        <CardHeader className="text-center">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <AuthFormWrapper />
        <CardFooter className="flex flex-col space-y-4">
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-zinc-600">
                {t("features.secureData.description")}
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-zinc-600">
                {t("features.trackExpenses.description")}
              </p>
            </div>
            <div className="text-center">
              <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-zinc-600">
                {t("features.manageBudgets.description")}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
