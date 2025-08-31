"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  UserIcon,
  Mail,
  Globe,
  Calendar,
  Shield,
  Camera,
  Save,
  Edit3,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { ProfileUserSchema, ProfileUser } from "@/lib/zod/profile-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useRouter } from "@/i18n/navigation";

interface UserProfile extends User {
  accountsCount: number;
  transactionsCount: number;
  goalsCount: number;
  investmentsCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<ProfileUser>({
    resolver: zodResolver(ProfileUserSchema),
  });

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setUserData(data.user);
        const formData = {
          ...data.user,
          dateOfBirth: data.user.dateOfBirth
            ? new Date(data.user.dateOfBirth).toISOString().split("T")[0]
            : "",
          settings: data.user.settings || {
            twoFactorEnabled: false,
            notifications: false,
            marketingEmail: false,
          },
        };
        reset(formData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [reset]);

  const onsubmit = async (data: ProfileUser) => {
    if (!isDirty) {
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
      setUserData(updatedData.user);
      reset({
        ...updatedData.user,
        dateOfBirth: updatedData.user.dateOfBirth
          ? new Date(updatedData.user.dateOfBirth).toISOString().split("T")[0]
          : null,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            User Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Back to Dashboard
          </Button>
          {isEditing ? (
            <>
              {isDirty && (
                <Button
                  type="button"
                  onClick={() => {
                    reset(); // Ripristina i valori iniziali del modulo
                    setIsEditing(false); // Esce dalla modalità di modifica
                  }}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                onClick={() => handleSubmit(onsubmit)()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Overview */}
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
                      : ""}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-accent hover:bg-accent/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">{watch("name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                  {userData?.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Last Login:</span>
                <span className="font-medium">
                  {userData?.lastLogin
                    ? new Date(userData.lastLogin).toLocaleDateString(
                        userData.language || "en"
                      )
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Member Since:</span>
                <span className="font-medium">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString(
                        userData.language || "en"
                      )
                    : ""}
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
                    {userData?.accountsCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Accounts</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/5">
                  <div className="text-2xl font-bold text-secondary">
                    {userData?.transactionsCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Transactions
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/5">
                  <div className="text-2xl font-bold text-accent">
                    {userData?.goalsCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Goals</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary">
                    {userData?.investmentsCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Investments
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <form
          className="lg:col-span-2 space-y-6"
          id="profileForm"
          onSubmit={handleSubmit(onsubmit)}
        >
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
                  <Select
                    value={watch("country") || ""}
                    onValueChange={(value) => setValue("country", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={watch("language") || ""}
                    onValueChange={(value) => setValue("language", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Your email address verification status
                    </p>
                  </div>
                  <Badge
                    variant={
                      userData?.emailVerified ? "default" : "destructive"
                    }
                  >
                    {userData?.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={watch("settings.twoFactorEnabled") || false}
                    onCheckedChange={(checked) =>
                      setValue("settings.twoFactorEnabled", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your account activity
                    </p>
                  </div>
                  <Switch
                    checked={watch("settings.notifications") || false}
                    onCheckedChange={(checked) =>
                      setValue("settings.notifications", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and updates
                    </p>
                  </div>
                  <Switch
                    checked={watch("settings.marketingEmail") || false}
                    onCheckedChange={(checked) =>
                      setValue("settings.marketingEmail", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
