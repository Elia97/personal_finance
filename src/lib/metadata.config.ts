import type { PagesConfig } from "./pages.config";
import { pagesConfig } from "./pages.config";

export function generateMetadata(page: keyof PagesConfig) {
  const { title, description } = pagesConfig[page] ?? pagesConfig["app"];
  return {
    title,
    description,
  };
}
