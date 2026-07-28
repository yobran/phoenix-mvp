import { api } from './client';

export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: 'USER' | 'ADMIN';
  referralCode: string | null;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface RegisterData {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
}

interface LoginData {
  phone: string;
  password: string;
}

export async function register(data: RegisterData) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export async function login(
  data: LoginData,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    '/auth/login',
    data,
  );

  return response.data;
}

export function saveAuth(response: AuthResponse) {
  localStorage.setItem(
    'phoenix_token',
    response.accessToken,
  );

  localStorage.setItem(
    'phoenix_user',
    JSON.stringify(response.user),
  );
}

export function saveToken(token: string) {
  localStorage.setItem('phoenix_token', token);
}

export function getToken() {
  return localStorage.getItem('phoenix_token');
}

export function getUser(): AuthUser | null {
  const user = localStorage.getItem('phoenix_user');

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export function isAdmin() {
  return getUser()?.role === 'ADMIN';
}

export function logout() {
  localStorage.removeItem('phoenix_token');
  localStorage.removeItem('phoenix_user');
}
