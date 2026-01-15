import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import axios from "axios";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload: decoded } = await jwtVerify(token, secret);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp - currentTime < 10 * 60) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newToken = response.data.accessToken;
      const responseHeaders = new Headers();
      responseHeaders.set(
        "Set-Cookie",
        `jwt=${newToken}; Path=/; HttpOnly; Secure; SameSite=Strict`
      );

      return NextResponse.next({
        headers: responseHeaders,
      });
    }

    const userRole = decoded.role as string;
    const pathname = req.nextUrl.pathname;
    const accessRules: Record<string, string[]> = {
      "/appointment": ["customer"],
      "/order-tracking": ["customer"]
    };

    for (const route in accessRules) {
      if (
        pathname.startsWith(route) &&
        !accessRules[route].includes(userRole)
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/appointment", "/order-tracking"],
};
