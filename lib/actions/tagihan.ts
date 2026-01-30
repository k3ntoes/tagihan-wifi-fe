"use server";

import { cookies } from "next/headers";
import type { TagihanFormValues } from "@/lib/schemas/tagihan";
import type { ApiSuccessMessage, PaginationResponse } from "@/types/api.types";
import type { Tagihan, TagihanSummaryResponse } from "@/types/tagihan.types";
import { API_URL } from "../utils";

/**
 * Get auth token from cookies
 */
async function getAuthToken() {
	const cookieStore = await cookies();
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
 * Get all tagihan with filters
 */
export async function getTagihans(
	params?: string,
): Promise<PaginationResponse<Tagihan>> {
	const url = params ? `/tagihan?${params}` : "/tagihan";
	return fetchWithAuth(url);
}

/**
 * Get tagihan by ID
 */
export async function getTagihanById(id: string): Promise<Tagihan> {
	return fetchWithAuth(`/tagihan/${id}`);
}

/**
 * Create new tagihan
 */
export async function createTagihan(
	data: TagihanFormValues,
): Promise<ApiSuccessMessage> {
	return fetchWithAuth("/tagihan", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * Update tagihan
 */
export async function updateTagihan(
	id: string,
	data: TagihanFormValues,
): Promise<ApiSuccessMessage> {
	return fetchWithAuth(`/tagihan/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

/**
 * Delete tagihan
 */
export async function deleteTagihan(id: string): Promise<ApiSuccessMessage> {
	return fetchWithAuth(`/tagihan/${id}`, {
		method: "DELETE",
	});
}

/**
 * Get tagihan summary by year
 */
export async function getTagihanSummary(
	tahun: number,
): Promise<TagihanSummaryResponse> {
	return fetchWithAuth(`/tagihan/summary/${tahun}`);
}
