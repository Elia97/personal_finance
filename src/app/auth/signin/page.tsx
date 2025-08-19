"use client";

import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Chrome,
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case "CredentialsSignin":
          setError("Credenziali non valide. Controlla email e password.");
          break;
        case "OAuthAccountNotLinked":
          setError("Questo account è già collegato con un altro provider.");
          break;
        case "OAuthCallback":
          setError("Errore durante l'autenticazione OAuth.");
          break;
        default:
          setError("Si è verificato un errore durante il login.");
      }
    }
  }, [urlError]);

  const handleCredentialsSignIn = async () => {
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email e password sono obbligatori");
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
        setError("Credenziali non valide. Riprova.");
      } else if (result?.ok) {
        // Verifica la sessione per ottenere i dati aggiornati
        const session = await getSession();

        if (session?.user?.status !== "ACTIVE") {
          setError("Il tuo account non è attivo. Contatta il supporto.");
          return;
        }

        router.push(callbackUrl);
      }
    } catch {
      setError("Errore di connessione. Riprova più tardi.");
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
      setError(`Errore durante l'autenticazione con ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl my-4">
      <Card className="shadow-2xl border-slate-200/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center font-semibold">
            Accedi al tuo account
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Gestisci le tue finanze in modo sicuro e intelligente
          </CardDescription>
        </CardHeader>

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
              <Chrome className="mr-2 h-4 w-4" />
              Continua con Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 font-medium hover:bg-slate-50 transition-colors"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              Continua con GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-medium">
                oppure
              </span>
            </div>
          </div>

          {/* Form Credentials */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
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
                  Ricordami
                </Label>
              </div>
              <Button
                variant="link"
                className="px-0 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => router.push("/auth/forgot-password")}
                disabled={isLoading}
              >
                Password dimenticata?
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
                  Accesso in corso...
                </>
              ) : (
                "Accedi"
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-center text-sm text-slate-600">
            Non hai un account?{" "}
            <Button
              variant="link"
              className="px-0 text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => router.push("/auth/signup")}
              disabled={isLoading}
            >
              Registrati qui
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-slate-600">
                Sicurezza
                <br />
                Bancaria
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-slate-600">
                Analytics
                <br />
                Avanzate
              </p>
            </div>
            <div className="text-center">
              <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-slate-600">
                Gestione
                <br />
                Completa
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-slate-400 text-sm">
        <p>Protetto da crittografia end-to-end</p>
        <p className="mt-1">
          <Button
            variant="link"
            className="px-0 text-slate-400 hover:text-white text-sm"
          >
            Privacy Policy
          </Button>
          {" • "}
          <Button
            variant="link"
            className="px-0 text-slate-400 hover:text-white text-sm"
          >
            Termini di Servizio
          </Button>
        </p>
      </div>
    </div>
  );
}
