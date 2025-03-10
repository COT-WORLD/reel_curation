import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';

export default withAuth(
    async function middleware(req) {
        const token = await getToken({ req });
        const isAuthenticated = !!token;

        if ((req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) && isAuthenticated) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                // Allow auth related routes
                if (!token && (pathname.startsWith("api/auth") || pathname === "/login" || pathname === "/register")) {
                    return true;
                }
                //Public routes
                if (token && (pathname === "/" || pathname.startsWith("api/videos"))) {
                    return true;
                }   
                return !!token;
            },
        },
    }
)

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"] };