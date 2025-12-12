'use server';

import { cookies } from 'next/headers';
import type { PaketFormValues } from '@/lib/schemas/paket';
import type { Paket } from '@/types/paket.types';
import type { PaginationResponse, ApiSuccessMessage } from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/api';

/**
 * Get auth token from cookies
 */
async function getAuthToken() {
    const cookieStore = await cookies();
    // Fallback to localStorage token if needed (passed from client)
    return cookieStore.get('access_token')?.value || null;
}

/**
 * Fetch with authentication
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ errors: 'Terjadi kesalahan' }));
        throw new Error(error.errors || error.detail || 'Terjadi kesalahan');
    }

    return response.json();
}

/**
 * Get all pakets
 */
export async function getPakets(): Promise<PaginationResponse<Paket>> {
    return fetchWithAuth('/paket');
}

/**
 * Get paket by ID
 */
export async function getPaketById(id: string): Promise<Paket> {
    return fetchWithAuth(`/paket/${id}`);
}

/**
 * Create new paket
 */
export async function createPaket(data: PaketFormValues): Promise<ApiSuccessMessage> {
    return fetchWithAuth('/paket', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Update paket
 */
export async function updatePaket(id: string, data: PaketFormValues): Promise<ApiSuccessMessage> {
    return fetchWithAuth(`/paket/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Delete paket
 */
export async function deletePaket(id: string): Promise<ApiSuccessMessage> {
    return fetchWithAuth(`/paket/${id}`, {
        method: 'DELETE',
    });
}
