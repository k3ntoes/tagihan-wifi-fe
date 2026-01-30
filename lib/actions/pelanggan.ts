"use server";

import { cookies } from "next/headers";
import type { PelangganFormValues } from "@/lib/schemas/pelanggan";
import type { ApiSuccessMessage, PaginationResponse } from "@/types/api.types";
import type { Pelanggan } from "@/types/pelanggan.types";
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
 * Get all pelanggans
 */
export async function getPelanggans(
	params?:
		| { search?: string; page?: number; size?: number; paket_id?: number }
		| string,
): Promise<PaginationResponse<Pelanggan>> {
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

		if (params.paket_id) {
			searchParams.append("paket_id", params.paket_id.toString());
		}

		queryString = searchParams.toString();
	}

	const url = queryString ? `/pelanggan?${queryString}` : "/pelanggan";

	return fetchWithAuth(url);
}

/**
 * Get pelanggan by ID
 */
export async function getPelangganById(id: string): Promise<Pelanggan> {
	return fetchWithAuth(`/pelanggan/${id}`);
}

/**
 * Create new pelanggan
 */
export async function createPelanggan(
	data: PelangganFormValues,
): Promise<ApiSuccessMessage> {
	return fetchWithAuth("/pelanggan", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * Update pelanggan
 */
export async function updatePelanggan(
	id: string,
	data: PelangganFormValues,
): Promise<ApiSuccessMessage> {
	return fetchWithAuth(`/pelanggan/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

/**
 * Delete pelanggan
 */
export async function deletePelanggan(id: string): Promise<ApiSuccessMessage> {
	return fetchWithAuth(`/pelanggan/${id}`, {
		method: "DELETE",
	});
}
