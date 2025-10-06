"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import HomeView from "@/views/HomeView";
import AuthController from "./AuthController";

export default function HomeController() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  function onSubmit() {
    setIsLoggingIn(true);
    console.log(isLoggingIn);
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
