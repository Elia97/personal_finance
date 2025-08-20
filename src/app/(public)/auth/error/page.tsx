"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-white">Authentication Error</h1>
      <p className="text-destructive text-center">
        {error || "An error occurred during login."}
      </p>
      <Button asChild variant="link" className="text-white">
        <Link href="/auth/signin">Back to login</Link>
      </Button>
    </div>
  );
}
