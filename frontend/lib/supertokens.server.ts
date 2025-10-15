"use client";

import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";

let inited = false;

export function ensureSuperTokensInit() {
  if (inited) {
    return;
  }
  inited = true;
  SuperTokens.init({
    appInfo: {
      appName: "CourseCompass",
      apiDomain: process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string,
      apiBasePath: "/auth",
      websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN as string,
      websiteBasePath: "/auth",
    },
    supertokens: {
      // These are obtained from the SuperTokens dashboard
      connectionURI: process.env.ST_CONNECTION_URI as string,
      apiKey: process.env.ST_API_KEY as string,
    },
    recipeList: [ThirdParty.init({}), Session.init()],
  });
}
