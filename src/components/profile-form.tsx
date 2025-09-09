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

import { User } from "next-auth";

interface UserProfile extends User {
  _count: {
    accounts: number;
    transactions: number;
    goals: number;
    investments: number;
  };
}

interface ProfileFormProps {
  userData: UserProfile | null;
  updateUserData: (data: UserProfile) => void;
}

export default function ProfileForm({
  userData,
  updateUserData,
}: ProfileFormProps) {
  const { update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [initialLanguage, setInitialLanguage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Evita hydration mismatch per componenti con ID dinamici
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
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }

      const updatedData = await res.json();
      updateUserData(updatedData.user);
      reset({
        ...updatedData.user,
        dateOfBirth: formatDate(updatedData.user.dateOfBirth),
      });
      toast.success("Profile updated successfully!");

      // Check if language changed
      if (data.language !== initialLanguage) {
        await update({ language: data.language });
        setInitialLanguage(data.language || null);
        // Set cookie for middleware
        document.cookie = `user-language=${data.language}; path=/; max-age=31536000`; // 1 year
        // Redirect to the same page with new locale
        let remainingPath = pathname.replace(/^\/(en|it)/, "");
        // Remove any additional locales
        while (remainingPath.match(/^\/(en|it)/)) {
          remainingPath = remainingPath.replace(/^\/(en|it)/, "");
        }
        if (!remainingPath.startsWith("/")) remainingPath = "/" + remainingPath;
        const newPathname = `/${data.language}${remainingPath}`;
        router.push(newPathname);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Imposta il form quando userData cambia
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
      setInitialLanguage(userData.language || null);
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
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                disabled={!isEditing}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
            Location & Language
          </CardTitle>
          <CardDescription>
            Set your location and language preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
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
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="IT">Italy</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
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
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                  Loading...
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
            Security & Preferences
          </CardTitle>
          <CardDescription>
            Manage your security settings and app preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
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

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your account activity
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
                <Label htmlFor="marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and updates
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
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </form>
  );
}
