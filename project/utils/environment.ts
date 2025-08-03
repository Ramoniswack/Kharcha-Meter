// Environment detection utility
export const getBaseURL = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const origin = window.location.origin;
    
    console.log('🌐 Environment detection - hostname:', hostname, 'origin:', origin);
    
    // If we're on localhost, use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${window.location.host}`;
    }
    
    // For Vercel or any other production domain
    if (hostname.includes('vercel.app') || hostname.includes('kharcha-meter')) {
      return origin;
    }
    
    // Fallback to current origin
    return origin;
  }
  
  // Server-side fallback
  // Check for Vercel environment variables
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check if we're in production based on NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'https://kharcha-meter.vercel.app';
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
