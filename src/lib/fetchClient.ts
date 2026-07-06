import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  data?: any;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

export const fetchClient = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { data, headers: customHeaders, ...customOptions } = options;
  const store = useAuthStore.getState();
  const token = store.accessToken;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    ...customOptions,
  };

  let response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = store.refreshToken;
      const isAuthRequest = endpoint.startsWith('/auth/');

      if (refreshToken) {
        try {
          const res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (res.ok) {
            const result = await res.json();
            store.setAuth(result.user, result.accessToken, result.refreshToken);
            isRefreshing = false;
            onRefreshed(result.accessToken);
            
            // Retry the original request
            return fetchClient<T>(endpoint, options);
          } else {
            store.logout();
            isRefreshing = false;
            throw new Error('Session expired');
          }
        } catch (error) {
          store.logout();
          isRefreshing = false;
          throw error;
        }
      } else {
        isRefreshing = false;
        if (isAuthRequest) {
          const errorData = await response.json().catch(() => ({ message: 'Unauthorized' }));
          throw errorData;
        }

        store.logout();
        throw new Error('No refresh token available');
      }
    } else {
      // Wait for the token to be refreshed
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          };
          resolve(fetchClient<T>(endpoint, options));
        });
      });
    }
  }

  // Next.js might return a 204 No Content which shouldn't be parsed as JSON
  if (response.status === 204) return {} as T;
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Something went wrong' };
    }
    throw errorData;
  }

  return response.json() as Promise<T>;
};
