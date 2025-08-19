"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-destructive text-center">
        {error || "An error occurred during login."}
      </p>
      <Button asChild variant="outline">
        <a href="/auth/signin">Back to login</a>
      </Button>
    </div>
  );
}
