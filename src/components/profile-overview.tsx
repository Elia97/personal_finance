"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Clock, Calendar } from "lucide-react";
import { formatDateLocalized } from "@/lib/utils";
import { getUserLocale } from "@/app/actions/user-actions";
import { useEffect, useState } from "react";
import { UserProfile } from "next-auth";
import { useTranslations } from "next-intl";

export default function ProfileOverview({
  userData,
}: {
  userData: UserProfile | null;
}) {
  const [userLocale, setUserLocale] = useState<string>("en-US");
  const t = useTranslations("profile.overview");

  useEffect(() => {
    const fetchUserLocale = async () => {
      try {
        const { language, country } = await getUserLocale();
        const localeString = `${language?.toLowerCase()}-${country?.toUpperCase()}`;
        setUserLocale(localeString);
      } catch {
        console.error(t("errorFetchingLocale"));
        setUserLocale("en-US");
      }
    };
    fetchUserLocale();
  }, [t]);

  if (!userData) return null;

  return (
    <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start space-y-6">
      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader className="text-center pb-4">
          <div className="relative mx-auto">
            <Avatar className="size-24 border-4 border-primary/20">
              <AvatarImage
                src={userData?.image || "/placeholder.svg"}
                alt={userData.name || "User Avatar"}
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {userData?.name
                  ? userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">{userData.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{t("email")}</span>
            <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {userData?.email}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{t("lastLogin")}</span>
            <span className="font-medium">
              {userData?.lastLogin
                ? formatDateLocalized(userData.lastLogin, userLocale)
                : "Never"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{t("memberSince")}</span>
            <span className="font-medium">
              {userData?.createdAt
                ? formatDateLocalized(userData.createdAt, userLocale)
                : "Unknown"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            {t("accountsOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">
                {userData._count?.bankAccounts || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("bankAccounts")}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/10">
              <div className="text-2xl font-bold text-secondary">
                {userData._count?.transactions || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("transactions")}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/10">
              <div className="text-2xl font-bold text-secondary">
                {userData._count?.goals || 0}
              </div>
              <div className="text-xs text-muted-foreground">{t("goals")}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">
                {userData._count?.investments || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("investments")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
