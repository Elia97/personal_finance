import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";

export default function ProfileHeader() {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          User Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      <Button
        type="button"
        asChild
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
