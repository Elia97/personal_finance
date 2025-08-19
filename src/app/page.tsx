import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata.config";
import path from "path";
import { fileURLToPath } from "url";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const page = path.basename(path.resolve(__dirname, "."));

export const metadata: Metadata = generateMetadata(page);

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Personal Finance</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage your finances effectively with our app.
      </p>
      <Link href="/auth/signin">
        <Button variant="outline">Accedi</Button>
      </Link>
    </section>
  );
}
