import { decodeJwt } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = [
	"/dashboard",
	"/paket",
	"/pelanggan",
	"/tagihan",
	"/users",
];
const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export async function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// 1. Check if route is protected or public
	// We treat root '/' as protected or public depending on app logic.
	// Usually dashboard is protected. If '/' redirects to dashboard, it's implicitly protected.
	// Let's assume '/' is protected for this app or redirects to dashboard.
	const isProtectedRoute =
		protectedRoutes.some((route) => path.startsWith(route)) || path === "/";
	const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

	// 2. Get tokens
	const accessToken = request.cookies.get("access_token")?.value;
	const refreshToken = request.cookies.get("refresh_token")?.value;

	// 3. Validation Logic
	let isValidSession = false;

	if (accessToken) {
		try {
			const payload = decodeJwt(accessToken);
			if (payload.exp && Date.now() < payload.exp * 1000) {
				isValidSession = true;
			}
		} catch (_) {
			// Invalid token
		}
	}

	// 4. Auto-Refresh Logic
	if (!isValidSession && refreshToken) {
		try {
			const API_URL =
				process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api";
			const response = await fetch(`${API_URL}/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refresh_token: refreshToken }),
			});

			if (response.ok) {
				const data = await response.json();
				const newAccessToken = data.access_token;
				const newRefreshToken = data.refresh_token; // If rotated

				// Create response to proceed
				const res = NextResponse.next();

				// Set new cookies
				// We need to decode to get expiration usually, or just set default
				const payload = decodeJwt(newAccessToken);
				const expires = payload.exp
					? new Date(payload.exp * 1000)
					: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

				res.cookies.set("access_token", newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					expires: expires,
					path: "/",
				});

				if (newRefreshToken) {
					const refreshPayload = decodeJwt(newRefreshToken);
					const refreshExpires = refreshPayload.exp
						? new Date(refreshPayload.exp * 1000)
						: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

					res.cookies.set("refresh_token", newRefreshToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						expires: refreshExpires,
						path: "/",
					});
				}

				isValidSession = true;

				// If we are on a protected route, we proceed with the new response (which has the Set-Cookie header)
				// If we are on public route, we might redirect to dashboard
				if (isPublicRoute) {
					return NextResponse.redirect(new URL("/", request.nextUrl));
				}

				return res;
			}
		} catch (error) {
			console.error("Refresh token failed:", error);
			// Refresh failed
		}
	}

	// 5. Redirects
	if (isProtectedRoute && !isValidSession) {
		return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
	}

	if (
		isPublicRoute &&
		isValidSession &&
		!request.nextUrl.pathname.startsWith("/dashboard")
	) {
		return NextResponse.redirect(new URL("/", request.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
