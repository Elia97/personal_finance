"use client";

import { User } from "next-auth";
import { useState } from "react";
import dynamic from "next/dynamic";
import ProfileHeader from "./profile-header";

const ProfileOverview = dynamic(() => import("./profile-overview"), {
  loading: () => <div>Loading overview...</div>,
});

const ProfileForm = dynamic(() => import("./profile-form"), {
  loading: () => <div>Loading form...</div>,
});

interface UserProfile extends User {
  _count: {
    accounts: number;
    transactions: number;
    goals: number;
    investments: number;
  };
}

interface ProfileClientProps {
  initialUserData: UserProfile;
}

export default function ProfileClient({ initialUserData }: ProfileClientProps) {
  const [userData, setUserData] = useState<UserProfile | null>(initialUserData);

  const updateUserData = (data: UserProfile) => {
    setUserData(data);
  };

  return (
    <>
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileOverview userData={userData} />
        <ProfileForm userData={userData} updateUserData={updateUserData} />
      </div>
    </>
  );
}
