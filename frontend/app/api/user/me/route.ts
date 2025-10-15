import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { getSSRSession } = await import("supertokens-node/nextjs");
  const { ensureSuperTokensInit } = await import("@/lib/supertokens.server");

  ensureSuperTokensInit();

  // SuperTokens getSSRSession (app router) expects an array of headers
  const headerList: { name: string; value: string }[] = [];
  for (const [name, value] of request.headers) {
    headerList.push({ name, value });
  }
  const session = await getSSRSession(headerList);

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
        cookie: request.headers.get("cookie") || "",
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
