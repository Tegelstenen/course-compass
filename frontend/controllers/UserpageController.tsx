"use client";

import { useSessionData } from "@/hooks/sessionHooks";
import { useUserData } from "@/hooks/userHooks";
import UserView from "@/views/UserView";

export default function UserpageController() {
  const userData = useUserData();
  const userId = useSessionData().userId;
  const { isLoading } = useSessionData();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <UserView userData={userData} userId={userId} />;
}
