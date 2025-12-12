// User Type
export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    role: 'ADMIN' | 'USER';
    pelanggan_id: string | null;
    created_at: string;
    updated_at: string;
}

// Login Request
export interface LoginRequest {
    username: string;
    password: string;
}

// Token Response
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// Register Request
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
}

// Change Password Request
export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

// Forgot Password Request
export interface ForgotPasswordRequest {
    email: string;
}

// Reset Password Request
export interface ResetPasswordRequest {
    token: string;
    new_password: string;
}

// Forgot Password Response
export interface ForgotPasswordResponse {
    message: string;
    reset_token?: string;
    expires_at?: string;
}
