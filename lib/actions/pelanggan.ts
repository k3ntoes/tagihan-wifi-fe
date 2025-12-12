'use server';

import { cookies } from 'next/headers';
import type { Pelanggan, PelangganRequest } from '@/types/pelanggan.types';
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

export async function getPelanggans(): Promise<PaginationResponse<Pelanggan>> {
    return fetchWithAuth('/pelanggan');
}

export async function getPelangganById(id: string): Promise<Pelanggan> {
    return fetchWithAuth(`/pelanggan/${id}`);
}

export async function createPelanggan(data: PelangganRequest): Promise<ApiSuccessMessage> {
    return fetchWithAuth('/pelanggan', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updatePelanggan(
    id: string,
    data: PelangganRequest
): Promise<ApiSuccessMessage> {
    return fetchWithAuth(`/pelanggan/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deletePelanggan(id: string): Promise<ApiSuccessMessage> {
    return fetchWithAuth(`/pelanggan/${id}`, {
        method: 'DELETE',
    });
}
