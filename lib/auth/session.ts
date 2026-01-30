import { decodeJwt } from "jose";
import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

interface TokenPayload {
	exp?: number;
	sub?: string;
	role?: string;
	[key: string]: any;
}

export async function setTokens(accessToken: string, refreshToken: string) {
	const cookieStore = await cookies();

	// Decode access token to get expiration
	const accessPayload = decodeJwt(accessToken) as TokenPayload;
	// Default to 7 days if no exp claim, otherwise usage exp * 1000 for milliseconds
	const accessExpires = accessPayload.exp
		? new Date(accessPayload.exp * 1000)
		: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	// Decode refresh token (optional, usually longer lived)
	const refreshPayload = decodeJwt(refreshToken) as TokenPayload;
	const refreshExpires = refreshPayload.exp
		? new Date(refreshPayload.exp * 1000)
		: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: accessExpires,
		path: "/",
	});

	cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: refreshExpires,
		path: "/",
	});
}

export async function getAccessToken() {
	const cookieStore = await cookies();
	return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
	const cookieStore = await cookies();
	return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function deleteTokens() {
	const cookieStore = await cookies();
	cookieStore.delete(ACCESS_TOKEN_COOKIE);
	cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function verifySession() {
	const accessToken = await getAccessToken();
	if (!accessToken) return null;

	try {
		// Simple client-side like verification (decode) - specific verification happens in DAL or Middleware via API
		const payload = decodeJwt(accessToken);

		// Check local expiration
		if (payload.exp && Date.now() >= payload.exp * 1000) {
			return null;
		}

		return payload as TokenPayload;
	} catch (_e) {
		return null;
	}
}

export async function getCurrentUser() {
	const session = await verifySession();
	if (!session) return null;

	// In a real app you might want to fetch fresh user data from DB here
	// using the ID from the token (session.sub or similar).
	// For now, we'll return the token payload which contains role and username.
	return {
		username: (session.sub || session.username || "User") as string,
		role: (session.role || "USER") as string,
		email: (session.email || "") as string,
		...session,
	};
}
