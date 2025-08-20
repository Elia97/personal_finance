import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata.config";
import path from "path";
import { fileURLToPath } from "url";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthButton from "@/components/auth-button";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let page = path.basename(path.resolve(__dirname, "."));

if (page.startsWith("(")) {
  page = path.basename(path.resolve(__dirname, ".."));
}

export const metadata: Metadata = generateMetadata(page);

export default function Home() {
  return (
    <>
      <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
        <div className="fixed top-6 right-12 z-20">
          <AuthButton />
        </div>
        {/* Content with enhanced styling */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          {(() => {
            const title =
              (metadata?.title as string) || "Welcome to Personal Finance";
            const [left, right] = title.split("-").map((s) => s.trim());

            return (
              <>
                {left}
                {right && (
                  <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    <br />
                    {right}
                  </span>
                )}
              </>
            );
          })()}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
          Take control of your finances with our smart, intuitive platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg font-semibold"
            >
              Get Started
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-300 text-blue-100 hover:bg-blue-800/20 hover:border-blue-200 px-8 py-3 text-lg font-semibold backdrop-blur-sm bg-transparent"
          >
            Discover Features
          </Button>
        </div>
      </section>
      <section className="h-screen"></section>
    </>
  );
}
