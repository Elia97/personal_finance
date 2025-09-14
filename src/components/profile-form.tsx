"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUserSchema, ProfileUser } from "@/lib/zod/profile-user-schema";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Globe, Shield, Save, Edit3 } from "lucide-react";
import { UserProfile } from "next-auth";
import { useTranslations } from "next-intl";

export default function ProfileForm({
  userData,
  updateUserData,
}: {
  userData: UserProfile | null;
  updateUserData: (data: UserProfile) => void;
}): React.JSX.Element | null {
  const { update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("profile.form");
  const [initialLanguage, setInitialLanguage] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<ProfileUser>({
    resolver: zodResolver(ProfileUserSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      dateOfBirth: formatDate(userData?.dateOfBirth),
      country: userData?.country || "",
      language: userData?.language || "en",
      settings: {
        twoFactorEnabled: false,
        notifications: true,
        marketingEmail: false,
      },
    },
  });

  const handleFormSubmit = async (data: ProfileUser) => {
    if (!isDirty) {
      toast("No changes detected.");
      setIsEditing(false);
      return;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString()
            : null,
        }),
      });

      if (!res.ok) {
        throw new Error(t("errorUpdatingProfile"));
      }

      const updatedData = await res.json();
      updateUserData(updatedData.user);
      reset({
        ...updatedData.user,
        dateOfBirth: formatDate(updatedData.user.dateOfBirth),
      });
      toast.success(t("profileUpdatedSuccessfully"));

      if (data.language !== initialLanguage) {
        await update({ language: data.language });
        setInitialLanguage(data.language || "");
        document.cookie = `user-language=${data.language}; path=/; max-age=31536000`; // 1 year
        let remainingPath = pathname.replace(/^\/(en|it)/, "");
        while (remainingPath.match(/^\/(en|it)/)) {
          remainingPath = remainingPath.replace(/^\/(en|it)/, "");
        }
        if (!remainingPath.startsWith("/")) remainingPath = "/" + remainingPath;
        const newPathname = `/${data.language}${remainingPath}`;
        router.push(newPathname);
      }

      setIsEditing(false);
    } catch {
      toast.error(t("errorUpdatingProfile"));
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  useEffect(() => {
    if (userData) {
      const formData = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        dateOfBirth: formatDate(userData.dateOfBirth),
        country: userData.country || "",
        language: userData.language || "en",
        settings: {
          twoFactorEnabled: false,
          notifications: true,
          marketingEmail: false,
        },
      };
      reset(formData);
      setInitialLanguage(userData.language || "");
    }
  }, [userData, reset]);

  if (!userData) return null;

  return (
    <form className="lg:col-span-2 space-y-6" id="profileForm">
      {/* Personal Information */}
      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            {t("personalInformation.title")}
          </CardTitle>
          <CardDescription>
            {t("personalInformation.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("personalInformation.fullName")}</Label>
              <Input
                id="name"
                {...register("name")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("personalInformation.emailAddress")}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("personalInformation.phoneNumber")}
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                {t("personalInformation.dateOfBirth")}
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Language */}
      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {t("location&language.title")}
          </CardTitle>
          <CardDescription>
            {t("location&language.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">
                {t("location&language.country.label")}
              </Label>
              {isClient ? (
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={!isEditing}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">
                          {t("location&language.country.US")}
                        </SelectItem>
                        <SelectItem value="IT">
                          {t("location&language.country.IT")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                  {t("location&language.country.loading")}...
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">
                {t("location&language.language.label")}
              </Label>
              {isClient ? (
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={!isEditing}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select your language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          {t("location&language.language.en")}
                        </SelectItem>
                        <SelectItem value="it">
                          {t("location&language.language.it")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                  {t("location&language.language.loading")}...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Preferences */}
      <Card className="bg-card/95 backdrop-blur-sm border-2 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t("security&preferences.title")}
          </CardTitle>
          <CardDescription>
            {t("security&preferences.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">
                  {t("security&preferences.twoFactorAuth.label")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("security&preferences.twoFactorAuth.description")}
                </p>
              </div>
              <Controller
                name="settings.twoFactorEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="twoFactor"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditing}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="changePassword">
                  {t("security&preferences.changePassword.label")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("security&preferences.changePassword.description")}
                </p>
              </div>
              <Button
                type="button"
                disabled={!isEditing}
                onClick={() => router.push("/auth/change-password")}
              >
                {t("security&preferences.changePassword.buttonText")}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">
                  {t("security&preferences.pushNotifications.label")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("security&preferences.pushNotifications.description")}
                </p>
              </div>
              <Controller
                name="settings.notifications"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditing}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing">
                  {t("security&preferences.marketingEmails.label")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("security&preferences.marketingEmails.description")}
                </p>
              </div>
              <Controller
                name="settings.marketingEmail"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="marketing"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditing}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        {isEditing ? (
          <>
            {isDirty && (
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {t("actionButtons.cancel")}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!isEditing}
            >
              <Save className="w-4 h-4 mr-2" />
              {t("actionButtons.saveChanges")}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {t("actionButtons.editProfile")}
          </Button>
        )}
      </div>
    </form>
  );
}
