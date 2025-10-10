"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import LandingPageView from "@/views/LandingPageView";
import AuthController from "./AuthController";

export default function HomeController() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  function onSubmit() {
    setIsLoggingIn(true);
  }

  if (isLoggingIn) {
    return <AuthController />;
  } else {
    return (
      <div>
        <Topbar />
        <LandingPageView onSubmit={onSubmit} />
      </div>
    );
  }
}
