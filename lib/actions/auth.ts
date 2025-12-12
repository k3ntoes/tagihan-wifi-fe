'use server';

import { deleteTokens, setTokens } from '@/lib/auth/session';
import { LoginRequest, TokenResponse } from '@/types/auth.types';
import { redirect } from 'next/navigation';
import { API_URL } from '../utils';


export async function loginAction(data: LoginRequest) {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Login gagal' }));
            throw new Error(error.detail || 'Login gagal');
        }

        const tokenData: TokenResponse = await response.json();

        // Set cookies
        await setTokens(tokenData.access_token, tokenData.refresh_token);

        return { success: true };
    } catch (error: any) {
        throw new Error(error.message || 'Terjadi kesalahan saat login');
    }
}

export async function registerAction(data: any) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Registrasi gagal' }));
            throw new Error(error.detail || 'Registrasi gagal');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Terjadi kesalahan saat registrasi');
    }
}

export async function logoutAction() {
    await deleteTokens();
    redirect('/auth/login');
}
