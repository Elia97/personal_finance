"use client";

import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Eye,
  EyeOff,
  CreditCard,
  Shield,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

export default function AuthForm() {
  const [isNewUser, setIsNewUser] = useState(false);
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordRepeat, setSignupPasswordRepeat] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  // Common
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case "CredentialsSignin":
          setError(
            "Invalid credentials. Please check your email and password."
          );
          break;
        case "OAuthAccountNotLinked":
          setError("This account is already linked with another provider.");
          break;
        case "OAuthCallback":
          setError("An error occurred during OAuth authentication.");
          break;
        default:
          setError("An error occurred during sign in. Please try again.");
      }
    }
  }, [urlError]);

  // LOGIN
  const handleCredentialsSignIn = async () => {
    setIsLoading(true);
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        const session = await getSession();
        if (session?.user?.status !== "ACTIVE") {
          setError("Your account is not active. Please contact support.");
          return;
        }
        router.push(callbackUrl);
      }
    } catch {
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    setIsLoading(true);
    setError("");
    if (
      !signupName ||
      !signupEmail ||
      !signupPassword ||
      !signupPasswordRepeat
    ) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    if (signupPassword !== signupPasswordRepeat) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the terms of service");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      if (res.ok) {
        // Automatic login after signup
        const loginRes = await signIn("credentials", {
          email: signupEmail,
          password: signupPassword,
          redirect: false,
        });
        if (loginRes?.ok) {
          router.push("/auth/new-user");
        } else {
          setError("Registration successful, but error during login.");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Registration error");
      }
    } catch {
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setError("");
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError(`Error during authentication with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardContent className="space-y-6">
        {error && (
          <Alert
            variant="destructive"
            className="animate-in slide-in-from-top-2"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Providers */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 font-medium hover:bg-slate-50 transition-colors"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
          >
            <span className="mr-2 flex items-center">
              <Image
                src="/google.svg"
                alt="Google Logo"
                width={20}
                height={20}
              />
            </span>
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 font-medium">or</span>
          </div>
        </div>

        {/* Form Credentials */}
        {!isNewUser ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  disabled={isLoading}
                  className="h-11 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 w-11 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-slate-600">
                  Remember me
                </Label>
              </div>
              <Button
                variant="link"
                className="px-0 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => router.push("/auth/forgot-password")}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>

            <Button
              onClick={handleCredentialsSignIn}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={signupName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSignupName(e.target.value)
                }
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSignupEmail(e.target.value)
                }
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSignupPassword(e.target.value)
                }
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="signup-password-repeat"
                className="text-sm font-medium"
              >
                Repeat password
              </Label>
              <Input
                id="signup-password-repeat"
                type="password"
                placeholder="••••••••"
                value={signupPasswordRepeat}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSignupPasswordRepeat(e.target.value)
                }
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={acceptTerms}
                onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
                disabled={isLoading}
              />
              <Label htmlFor="accept-terms" className="text-sm text-slate-600">
                I accept the{" "}
                <a href="/terms" target="_blank" className="underline">
                  terms of service
                </a>
              </Label>
            </div>
            <Button
              onClick={handleSignup}
              className="w-full h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-6">
        <div className="text-center text-sm text-slate-600">
          {!isNewUser ? (
            <>
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="px-0 text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsNewUser(true)}
                disabled={isLoading}
              >
                Sign up here
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="px-0 text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsNewUser(false)}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">
              Bank-level
              <br />
              Security
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">
              Advanced
              <br />
              Analytics
            </p>
          </div>
          <div className="text-center">
            <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">
              All-in-one
              <br />
              Management
            </p>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
