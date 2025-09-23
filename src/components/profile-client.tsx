"use client";

import { UserProfile } from "next-auth";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ProfileOverview = dynamic(() => import("./profile-overview"), {
  loading: () => <Loader2 className="animate-spin" />,
});

const ProfileForm = dynamic(() => import("./profile-form"), {
  loading: () => <Loader2 className="animate-spin" />,
});

export default function ProfileClient({
  initialUserData,
}: {
  initialUserData: UserProfile;
}) {
  const [userData, setUserData] = useState<UserProfile | null>(initialUserData);

  const updateUserData = (data: UserProfile) => {
    setUserData(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ProfileOverview userData={userData} />
      <ProfileForm userData={userData} updateUserData={updateUserData} />
    </div>
  );
}
