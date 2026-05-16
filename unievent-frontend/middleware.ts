import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { toast } from "react-toastify";

export function das_middleware(request: NextRequest) {
  //dotenv.config();
  //read current pathname
  const currentroute = request.nextUrl.pathname;
  //get the token
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth?mode=signup?reasosn=account", request.url),
    );
  }
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET! || "defaultuser",
    );

    if (
      currentroute.startsWith("/admindashboard") &&
      decoded.role !== "admin"
    ) {
      return new NextResponse("Not Found", {
        status: 404,
      });
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/AdminLoginForm", request.url));
  }
}

// Apply middleware only on admin dashboard
export const config = {
  matcher: ["/admindashboard/:path*"],
};

export default das_middleware;
