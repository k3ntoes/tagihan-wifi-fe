"use server";

import { cookies } from "next/headers";
import type { PaketFormValues } from "@/lib/schemas/paket";
import type { ApiSuccessMessage, PaginationResponse } from "@/types/api.types";
import type { Paket } from "@/types/paket.types";
import { API_URL } from "../utils";

/**
 * Get auth token from cookies
 */
async function getAuthToken() {
	const cookieStore = await cookies();
	// Fallback to localStorage token if needed (passed from client)
	return cookieStore.get("access_token")?.value || null;
}

/**
 * Fetch with authentication
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
	const token = await getAuthToken();

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	const response = await fetch(`${API_URL}${url}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ errors: "Terjadi kesalahan" }));
		throw new Error(error.errors || error.detail || "Terjadi kesalahan");
	}

	return response.json();
}

/**
 * Get all pakets
 */
export async function getPakets(
	params?: { search?: string; page?: number; size?: number } | string,
): Promise<PaginationResponse<Paket>> {
	let queryString = "";

	if (typeof params === "string") {
		queryString = params;
	} else if (params) {
		const searchParams = new URLSearchParams();

		if (params.search) {
			searchParams.append("nama", params.search);
		}

		if (params.page) {
			searchParams.append("page", params.page.toString());
		}

		if (params.size) {
			searchParams.append("size", params.size.toString());
		}
		queryString = searchParams.toString();
	}

	const url = queryString ? `/paket?${queryString}` : "/paket";

	return fetchWithAuth(url);
}

/**
 * Get paket by ID
 */
export async function getPaketById(id: string): Promise<Paket> {
	const result = await fetchWithAuth(`/paket/${id}`);
	console.log(result);
	return result;
}

/**
 * Create new paket
 */
export async function createPaket(
	data: PaketFormValues,
): Promise<ApiSuccessMessage> {
	return fetchWithAuth("/paket", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * Update paket
 */
export async function updatePaket(
	id: string,
	data: PaketFormValues,
): Promise<ApiSuccessMessage> {
	return fetchWithAuth(`/paket/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

/**
 * Delete paket
 */
export async function deletePaket(id: string): Promise<ApiSuccessMessage> {
	return fetchWithAuth(`/paket/${id}`, {
		method: "DELETE",
	});
}
