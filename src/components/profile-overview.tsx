"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Clock, Calendar, TrendingUp } from "lucide-react";
import { formatDateLocalized } from "@/lib/utils";
import { getUserLocale } from "@/app/actions/user-actions";
import { useEffect, useState } from "react";
import { User } from "next-auth";

interface UserProfile extends User {
  _count: {
    accounts: number;
    transactions: number;
    goals: number;
    investments: number;
  };
}

interface ProfileOverviewProps {
  userData: UserProfile | null;
}

export default function ProfileOverview({ userData }: ProfileOverviewProps) {
  const [userLocale, setUserLocale] = useState<string>("en-US");

  // Ottieni il locale dell'utente
  useEffect(() => {
    const fetchUserLocale = async () => {
      try {
        const locale = await getUserLocale();
        const localeString = locale.language === "it" ? "it-IT" : "en-US";
        setUserLocale(localeString);
      } catch (error) {
        console.error("Error fetching user locale:", error);
        setUserLocale("en-US");
      }
    };
    fetchUserLocale();
  }, []);

  if (!userData) return null;

  return (
    <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start space-y-6">
      {/* Profile Card */}
      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader className="text-center pb-4">
          <div className="relative mx-auto">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage
                src={userData?.image || "/placeholder.svg"}
                alt={userData?.name ?? undefined}
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
          <CardTitle className="text-xl">{userData.name || "User"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {userData?.email || "Not set"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Last Login:</span>
            <span className="font-medium">
              {userData?.lastLogin
                ? formatDateLocalized(userData.lastLogin, userLocale)
                : "Never"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Member Since:</span>
            <span className="font-medium">
              {userData?.createdAt
                ? formatDateLocalized(userData.createdAt, userLocale)
                : "Unknown"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">
                {userData._count?.accounts || 0}
              </div>
              <div className="text-xs text-muted-foreground">Accounts</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/5">
              <div className="text-2xl font-bold text-secondary">
                {userData._count?.transactions || 0}
              </div>
              <div className="text-xs text-muted-foreground">Transactions</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-accent/5">
              <div className="text-2xl font-bold text-accent">
                {userData._count?.goals || 0}
              </div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">
                {userData._count?.investments || 0}
              </div>
              <div className="text-xs text-muted-foreground">Investments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
