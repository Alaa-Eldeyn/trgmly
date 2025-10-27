import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localeDetection: false,
});

export function middleware(req: NextRequest) {
  return intlMiddleware(req) || NextResponse.next();
}

// 📌 Apply middleware to relevant routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|images|sitemap.xml|robots.txt|googled02dc937f6d8947f.html).*)",
  ],
};
