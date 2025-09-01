"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { NewUserFormValues, newUserSchema } from "@/lib/zod/new-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function NewUserPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
  });

  const onSubmit = async (data: NewUserFormValues) => {
    setLoading(true);
    if (isDirty) {
      try {
        const res = await fetch("/api/user/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            dateOfBirth: data.dateOfBirth?.toISOString(), // Converte in stringa ISO
          }),
        });
        if (!res.ok)
          throw new Error("Errore durante l'aggiornamento del profilo");
        setTimeout(
          () => router.push("/dashboard", { locale: data.language }),
          1500
        );
      } catch (error) {
        console.error("Errore durante l'aggiornamento del profilo:", error);
      }
    } else {
      console.log("Nessuna modifica, proseguo senza inviare dati.");
    }
    setLoading(false);
  };

  if (!session) return null;

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-center">
            Benvenuto! Completa il tuo profilo
          </h2>
          <p className="text-center text-sm text-gray-600">
            Benvenuto, ${session.user.name || session.user.email}! Per
            continuare, inserisci i dati mancanti.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="phone" className="mb-2">
                Telefono
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="Inserisci il numero di telefono"
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="language" className="mb-2">
                Lingua
              </Label>
              <Input
                id="language"
                type="text"
                {...register("language")}
                placeholder="es: it, en, fr"
              />
              {errors.language && (
                <p className="text-xs text-destructive mt-1">
                  {errors.language.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="country" className="mb-2">
                Paese
              </Label>
              <Input
                id="country"
                type="text"
                {...register("country")}
                placeholder="es: IT, US, FR"
              />
              {errors.country && (
                <p className="text-xs text-destructive mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-2">Data di nascita</Label>
              <div className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={watch("dateOfBirth")}
                  onSelect={(date) => setValue("dateOfBirth", date)}
                  captionLayout="dropdown"
                  className="rounded-md border shadow mt-2"
                  required
                />
                {errors.dateOfBirth && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva e continua"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          Puoi modificare questi dati anche in seguito dalle impostazioni del
          profilo.
        </CardFooter>
      </Card>
    </section>
  );
}
