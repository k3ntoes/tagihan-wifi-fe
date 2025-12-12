'use server';

import { cookies } from 'next/headers';
import type { Tagihan, TagihanRequest, TagihanSummaryResponse } from '@/types/tagihan.types';
import type { PaginationResponse, ApiSuccessMessage } from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/api';

async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('access_token')?.value || null;
}

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

export async function getTagihans(): Promise<PaginationResponse<Tagihan>> {
    return fetchWithAuth('/tagihan');
}

export async function getTagihanById(id: string): Promise<Tagihan> {
    return fetchWithAuth(`/tagihan/${id}`);
}

export async function createTagihan(data: TagihanRequest): Promise<ApiSuccessMessage> {
    return fetchWithAuth('/tagihan', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateTagihan(
    id: string,
    data: TagihanRequest
): Promise<ApiSuccessMessage> {
    return fetchWithAuth(`/tagihan/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteTagihan(id: string): Promise<ApiSuccessMessage> {
    return fetchWithAuth(`/tagihan/${id}`, {
        method: 'DELETE',
    });
}

export async function getTagihanSummary(tahun: number): Promise<TagihanSummaryResponse> {
    return fetchWithAuth(`/tagihan/summary/${tahun}`);
}
