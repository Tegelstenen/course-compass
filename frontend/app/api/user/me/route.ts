import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/lib/supertokens.server";

ensureSuperTokensInit();

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return new NextResponse("Authentication required", { status: 401 });
  }

  const backendDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
  if (!backendDomain) {
    throw new Error("NEXT_PUBLIC_BACKEND_DOMAIN is not set");
  }

  try {
    const response = await fetch(`${backendDomain}/user/me`, {
      headers: {
        cookie: headers().get("cookie") || "",
      },
    });

    if (!response.ok) {
      return new NextResponse(await response.text(), {
        status: response.status,
      });
    }

    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
}
