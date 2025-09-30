"use client";

import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdParty, { Google } from "supertokens-auth-react/recipe/thirdparty";

const NEXT_PUBLIC_BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
const NEXT_PUBLIC_WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;

if (
  typeof NEXT_PUBLIC_BACKEND_DOMAIN !== "string" ||
  !NEXT_PUBLIC_BACKEND_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_BACKEND_DOMAIN is not set");
}
if (
  typeof NEXT_PUBLIC_WEBSITE_DOMAIN !== "string" ||
  !NEXT_PUBLIC_WEBSITE_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_WEBSITE_DOMAIN is not set");
}

let inited = false;

export function initST() {
  // ⛔️ Don’t init on the server
  if (typeof window === "undefined") return;

  if (inited) return;
  inited = true;

  SuperTokens.init({
    appInfo: {
      appName: "CourseCompass",
      apiDomain: process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string,
      apiBasePath: "/auth",
      websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN as string,
      websiteBasePath: "/auth",
    },
    recipeList: [
      Session.init(),
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [Google.init()],
        },
      }),
    ],
  });
}
