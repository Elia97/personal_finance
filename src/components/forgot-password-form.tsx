"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Errore durante l'invio");
      }
    } catch {
      setError("Errore di rete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-bold">Forgot Password</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p className="text-lg text-muted-foreground mb-4">
            Please enter your email to reset the password.
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {message && (
              <p className="text-green-500 text-sm mt-2">{message}</p>
            )}
          </form>
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Invio..." : "Invia"}
        </Button>
      </CardFooter>
    </Card>
  );
}
