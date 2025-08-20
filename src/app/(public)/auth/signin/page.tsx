import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/auth-form";
import { generateMetadata } from "@/lib/metadata.config";
import path from "path";
import { fileURLToPath } from "url";
import type { Metadata } from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const page = path.basename(path.resolve(__dirname, "."));

export const metadata: Metadata = generateMetadata(page);

export default function SignInPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
      <Card className="shadow-2xl border-slate-200/20 bg-white/95 backdrop-blur-sm w-full max-w-xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center font-semibold">
            {(metadata?.title as string).split("-")[0] ||
              "Sign in to your account"}
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            {metadata?.description ||
              "Securely manage your finances with confidence"}
          </CardDescription>
        </CardHeader>
        <AuthForm />
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-slate-400 text-sm">
        <p>Protected by end-to-end encryption</p>
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
            Terms of Service
          </Button>
        </p>
      </div>
    </section>
  );
}
