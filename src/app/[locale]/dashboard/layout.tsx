import { requireActiveStatus } from "@/lib/auth-utils";
import BackgroundPrivate from "@/components/background-private";

export default async function PrivateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const paramsList = await params;
  const locale = paramsList.locale;

  await requireActiveStatus(locale);

  return <BackgroundPrivate>{children}</BackgroundPrivate>;
}
