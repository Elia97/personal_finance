"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";

export default function NewUserPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    phone: "",
    language: "",
    country: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      if (!dateOfBirth) throw new Error("Seleziona la data di nascita");
      // Chiamata API per aggiornare l'utente
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dateOfBirth: dateOfBirth.toISOString().split("T")[0],
        }),
      });
      if (!res.ok)
        throw new Error("Errore durante l'aggiornamento del profilo");
      setSuccess(true);
      setTimeout(
        () => router.push("/dashboard", { locale: form.language }),
        1500
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Errore generico");
      } else {
        setError("Errore generico");
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
            Completa il tuo profilo
          </h2>
          <p className="text-center text-sm text-gray-600">
            Benvenuto, {session.user.name || session.user.email}!<br />
            Per continuare, inserisci i dati mancanti.
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default">
              <AlertDescription>
                Profilo aggiornato! Reindirizzamento...
              </AlertDescription>
            </Alert>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="phone" className="mb-2">
                Telefono
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Inserisci il numero di telefono"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="language" className="mb-2">
                Lingua
              </Label>
              <Input
                id="language"
                name="language"
                type="text"
                placeholder="es: it, en, fr"
                value={form.language}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="country" className="mb-2">
                Paese
              </Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="es: IT, US, FR"
                value={form.country}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Data di nascita</Label>
              <div className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  captionLayout="dropdown"
                  className="rounded-md border shadow mt-2"
                  required
                />
                {!dateOfBirth && (
                  <span className="text-xs text-red-500 mt-1">
                    Seleziona la data di nascita
                  </span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva e continua"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-gray-400">
          Puoi modificare questi dati anche in seguito dalle impostazioni del
          profilo.
        </CardFooter>
      </Card>
    </section>
  );
}
