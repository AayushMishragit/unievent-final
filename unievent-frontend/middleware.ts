import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // ✅ use jose instead of jsonwebtoken

export async function middleware(request: NextRequest) {
  // ✅ add async
  const currentroute = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  console.log("🔍 Route:", currentroute);
  console.log("🔍 Token found:", !!token);

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth?mode=signin&reason=not_logged_in", request.url),
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!); // ✅ jose needs Uint8Array

    const { payload } = await jwtVerify(token, secret); // ✅ use jwtVerify from jose

    console.log("✅ Decoded:", payload);

    if (payload.role !== "admin") {
      return NextResponse.redirect(
        new URL("/auth?mode=signin&reason=unauthorized", request.url),
      );
    }

    return NextResponse.next();
  } catch (err) {
    console.log("❌ JWT error:", err);
    return NextResponse.redirect(
      new URL("/auth?mode=signin&reason=session_expired", request.url),
    );
  }
}

export const config = {
  matcher: ["/createevent/:path*", "/admindashboard/:path*"],
};
