"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    setResendSuccess(false);
    setResendError("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }), // Sostituisci con l'email dell'utente
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Errore durante l'invio dell'email"
        );
      }
      setResendSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResendError(err.message || "Errore generico");
      } else {
        setResendError("Errore generico");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-center">
            Verifica la tua email
          </h2>
          <p className="text-center text-sm text-gray-600">
            Ti abbiamo inviato un&apos;email con un link per verificare il tuo
            indirizzo. Controlla la tua casella di posta e segui le istruzioni.
          </p>
          {resendError && (
            <Alert variant="destructive">
              <AlertDescription>{resendError}</AlertDescription>
            </Alert>
          )}
          {resendSuccess && (
            <Alert variant="default">
              <AlertDescription>Email inviata con successo!</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleResendEmail}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Invio in corso..." : "Invia di nuovo l'email"}
          </Button>
          <Button onClick={() => router.push("/auth/signin")} variant="link">
            Torna al login
          </Button>
        </CardContent>
        <CardFooter className="text-center text-xs text-gray-400">
          Se non trovi l&apos;email, controlla la cartella dello spam o riprova
          più tardi.
        </CardFooter>
      </Card>
    </section>
  );
}
