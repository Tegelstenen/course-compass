"use client";

import { useSessionData } from "@/hooks/sessionHooks";
import { useUserData } from "@/hooks/userHooks";
import UserView from "@/views/UserView";

export default function UserpageController() {
  const userData = useUserData();
  const { isLoading, userId } = useSessionData();

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return <UserView userData={userData} />;
  }
}
