const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api";

export const authApi = {
	forgotPassword: async (data: { email: string }) => {
		const response = await fetch(`${API_URL}/auth/forgot-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Gagal mengirim token reset");
		}

		return response.json();
	},

	resetPassword: async (data: { token: string; new_password: string }) => {
		const response = await fetch(`${API_URL}/auth/reset-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Gagal reset password");
		}

		return response.json();
	},

	getCurrentUser: async () => {
		// This is a client-side helper if needed, but we mostly use session provider now
		// or Server Actions. Keeping it for compatibility if any component calls it directly.
		// Simple fetch to /auth/me if we have a token in cookies (browser handles it automatically for same site)
		// or if we rely on the proxy to forward.
		return null;
	},
};
