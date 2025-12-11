const BASE_URL = (import.meta as any).env?.VITE_API_URL || (process as any).env?.REACT_APP_API_URL || 'http://localhost:3001/api';

export type LoginResponse = {
  token: string;
  user: { id: string; name: string; email?: string; role: 'student'|'tutor'|'admin'; rollNumber?: string };
};

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }
  return res.json();
}

export async function registerStudent(params: { name: string; password: string; rollNumber: string; email?: string }): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: params.name, password: params.password, rollNumber: params.rollNumber, email: params.email, role: 'student' })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Registration failed');
  }
  return res.json();
}

export async function registerTutor(params: { name: string; password: string; email: string }): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: params.name, password: params.password, email: params.email, role: 'tutor' })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Registration failed');
  }
  return res.json();
}
