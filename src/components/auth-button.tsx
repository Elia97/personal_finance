"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    );
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <Button onClick={() => signIn("google")} variant="outline">
          Google
        </Button>
        <Button onClick={() => router.push("/auth/signin")} variant="default">
          Login
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-16 rounded-full">
          <Avatar className="size-16">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || ""}
            />
            <AvatarFallback className="text-3xl font-serif">
              {session.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">
            {session.user.name}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session.user.email}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            Role: {session.user.role}
          </p>
          {session.user.country && (
            <p className="text-xs leading-none text-muted-foreground">
              Country: {session.user.country}
            </p>
          )}
          <p className="text-xs leading-none text-muted-foreground">
            Status:{" "}
            <span
              className={`font-medium ${
                session.user.status === "ACTIVE"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {session.user.status}
            </span>
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          Settings
        </DropdownMenuItem>
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
