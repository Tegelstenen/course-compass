"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import HomeView from "@/views/HomeView";
import AuthController from "./AuthController";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch, RootState } from "@/state/store";
import { getSession } from "@/state/session/sessionSlice";

export default function HomeController() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<Dispatch>();
  
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.session
  );

  useEffect(() => {
    // Check session on mount
    dispatch(getSession());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to /search if user is authenticated
    if (!isLoading && isAuthenticated) {
      router.push("/search");
    }
  }, [isAuthenticated, isLoading, router]);

  function onSubmit() {
    setIsLoggingIn(true);
  }

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

  if (isLoggingIn) {
    return <AuthController />;
  } else {
    return (
      <div>
        <Topbar />
        <HomeView onSubmit={onSubmit} />
      </div>
    );
  }
}
