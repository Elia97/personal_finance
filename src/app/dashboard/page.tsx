import { getAuthSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <div>Dashboard</div>;
}
