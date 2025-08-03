// Environment detection utility
export const getBaseURL = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // If we're on localhost, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://${window.location.host}`;
    }
    // Otherwise use the current origin (for Vercel deployment)
    return window.location.origin;
  }
  
  // Fallback for server-side rendering or when window is not available
  // Check environment variables
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Development fallback
  return 'http://localhost:8081';
};

export const getAuthCallbackURL = (): string => {
  return `${getBaseURL()}/auth/callback`;
};

export const getResetPasswordURL = (): string => {
  return `${getBaseURL()}/auth/reset-password`;
};
