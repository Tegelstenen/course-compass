"use client";

import AuthView from "../views/AuthView";

function handleSubmit(provider: Provider) {
  console.log("signing in with", provider);
}

function AuthController() {
  return <AuthView onSubmit={handleSubmit} />;
}

export default AuthController;
