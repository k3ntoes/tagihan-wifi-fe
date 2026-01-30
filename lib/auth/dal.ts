import { redirect } from "next/navigation";
import { cache } from "react";
import { getAccessToken, verifySession } from "@/lib/auth/session";
import type { User } from "@/types/auth.types";
import "server-only";

// Memoize request for current user to avoid duplicates in same request cycle
export const getUser = cache(async (): Promise<User | null> => {
	const session = await verifySession();
	if (!session) return null;

	try {
		// We need to pass the token because axios interceptor on server might not catch the cookie
		// unless we wired it up specific.
		// Better: use authApi which uses apiClient.
		// However, apiClient needs to know how to get the token on server.
		// For now, let's assume apiClient or authApi can handle it OR we manually pass token.
		// Since `authApi` uses `apiClient` which might be client-side optimized (localStorage),
		// we should check if `apiClient` works on server.
		// If `apiClient` uses localStorage, it fails on server.
		// We should fix `apiClient` or make a server-specific fetch here.

		/* 
           NOTE: Existing api/auth.ts uses a simple axios instance usually.
           If we want to reuse it, we must ensure it doesn't fail on localStorage access.
           For the DAL, we often want a direct fetch using the token we just retrieved.
        */

		const token = await getAccessToken();
		if (!token) return null;

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api"}/auth/me`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				cache: "no-store",
			},
		);

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch (_error) {
		return null;
	}
});

export const verifySessionAndRedirect = async () => {
	const session = await verifySession();
	if (!session) {
		redirect("/auth/login");
	}
	return session;
};
