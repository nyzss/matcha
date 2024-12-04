import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes, publicRoutes } from "./components/layout/navigations";
import { checkLoggedIn } from "./lib/api";

export default async function middleware(req: NextRequest) {
    const isProtected = protectedRoutes.includes(req.nextUrl.pathname);
    const isUnprotected = publicRoutes.includes(req.nextUrl.pathname);

    const isLoggedIn = await checkLoggedIn(
        req.cookies.get("accessToken")?.value,
        req.cookies.get("refreshToken")?.value,
        req.nextUrl.origin
    );

    if (isUnprotected && isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    } else if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
