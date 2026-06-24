import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY_DOMAIN = "libertylifeperth.org";
const REDIRECT_DOMAINS = [
  "libertylifeperth.com",
  "libertylifecentre.org",
  "libertylifecentre.com",
];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const domain = host.replace(/^www\./, "").split(":")[0];

  if (REDIRECT_DOMAINS.includes(domain)) {
    const destination = `https://${PRIMARY_DOMAIN}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(destination, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
