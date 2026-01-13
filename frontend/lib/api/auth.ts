import { api } from '@/lib/axios';

export interface AuthResponse {
    auth_token: string;
}

export interface LoginCredentials {
    email?: string;
    password?: string;
}

export interface RegisterCredentials {
    email?: string;
    password?: string;
    re_password?: string;
    first_name?: string;
    last_name?: string;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/token/login/', credentials);
    return data;
};

export const registerUser = async (credentials: RegisterCredentials) => {
    const { data } = await api.post('/auth/users/', credentials);
    return data;
};

export const logoutUser = async () => {
    await api.post('/auth/token/logout/');
};

export const getCurrentUser = async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/users/me/');
    return data;
};
