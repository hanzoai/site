// The access token of a signed-in visitor, which hanzo.ai's sign-in keeps in this browser, or null. A call that needs
// a person asks only when there is one: a signed-out visitor's request would answer 401 and fill their console.
export function liveToken(): string | null {
  try {
    const token = localStorage.getItem('hanzo_iam_access_token');
    if (!token) return null;
    const exp = Number(localStorage.getItem('hanzo_iam_expires_at') || 0);
    return exp && exp < Date.now() ? null : token;
  } catch {
    return null;
  }
}

export const hasLiveSession = () => liveToken() !== null;
