export const getAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    return token ? `Bearer ${token}` : '';
  }
  return '';
};

export const setAuthCookie = (token: string) => {
  if (typeof window !== 'undefined') {
    // Set cookie for 1 day, accessible by server and client
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
};

export const removeAuthCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};
