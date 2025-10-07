"use client";

import { type Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "@/state/session/sessionSlice";
import type { RootState } from "../state/store";

export function useSessionData() {
  const dispatch = useDispatch<Dispatch>();
  const { userId, isLoading } = useSelector(
    (state: RootState) => state.session,
  );

  useEffect(() => {
    // (optional app logic)
    dispatch(getSession());
  }, [dispatch]);

  return { userId, isLoading };
}
