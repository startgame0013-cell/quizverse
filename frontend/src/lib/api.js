const TOKEN_KEY = 'quizverse_token';
const USER_KEY = 'quizverse_user';

function handleUnauthorized() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
}

/** Fetch with 401 handling - clears session and redirects to login on Unauthorized (except auth endpoints) */
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 && !url.includes('/api/auth/')) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  return res;
}
