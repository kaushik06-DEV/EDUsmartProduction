// services/apiService.ts

// Best Practice: Use environment variables for the API base URL.
// This allows you to easily switch between development, staging, and production.
// In a Create React App or Vite project, you would use import.meta.env.VITE_API_URL or process.env.REACT_APP_API_URL
const BASE_URL = (import.meta as any)?.env?.VITE_API_URL || (process as any)?.env?.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * A custom error class for API-specific errors.
 * This allows us to catch API errors specifically and access the status code.
 */
export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Retrieves the authentication token from localStorage.
 * @returns The token string or null if not found.
 */
const getToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.warn("Could not read token from localStorage", error);
    return null;
  }
};

/**
 * A generic function to handle all API requests.
 * It sets the appropriate headers, includes the auth token, and handles responses.
 * @param endpoint The API endpoint to call (e.g., '/courses').
 * @param method The HTTP method ('GET', 'POST', 'PUT', 'DELETE').
 * @param body The request payload for POST/PUT requests.
 * @param signal An AbortSignal to allow for request cancellation.
 * @returns A promise that resolves with the JSON response.
 */
const apiService = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    signal,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null as T;
    }

    const responseData = await response.json().catch(() => {
      return { message: response.statusText || 'An unknown error occurred.' };
    });

    if (!response.ok) {
      throw new ApiError(
        (responseData as any).message || 'API request failed',
        response.status,
        responseData
      );
    }

    return responseData as T;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Network or unexpected error in apiService:", error);
    throw new Error('Network error or invalid response.');
  }
};

export const api = {
  get: <T>(endpoint: string, signal?: AbortSignal) => apiService<T>(endpoint, 'GET', undefined, signal),
  post: <T>(endpoint: string, body: Record<string, unknown>, signal?: AbortSignal) => apiService<T>(endpoint, 'POST', body, signal),
  put: <T>(endpoint:string, body: Record<string, unknown>, signal?: AbortSignal) => apiService<T>(endpoint, 'PUT', body, signal),
  delete: <T>(endpoint: string, signal?: AbortSignal) => apiService<T>(endpoint, 'DELETE', undefined, signal),
};