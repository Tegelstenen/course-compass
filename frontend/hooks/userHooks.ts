"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../state/store";

// exports the full user data
export function useUserData() {
  const userState = useSelector((state: RootState) => state.user);
  console.log("In hook", userState);
  return userState;
}

// exports parts of the user data (not sure if needed, but good practice if only some parts of user data are needed)
export function useUserName() {
  return useSelector((state: RootState) => state.user.name);
}

export function useUserEmail() {
  return useSelector((state: RootState) => state.user.email);
}
