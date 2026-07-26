import { api } from './client';

interface AuthResponse {
  accessToken: string;
}

interface RegisterData {
  name: string;
  phone: string;
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

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export function saveToken(token: string) {
  localStorage.setItem('phoenix_token', token);
}

export function getToken() {
  return localStorage.getItem('phoenix_token');
}

export function logout() {
  localStorage.removeItem('phoenix_token');
}
