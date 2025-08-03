import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utilities for debugging and managing app data persistence
 */

export class StorageUtils {
  // Key used by Supabase for session storage
  private static readonly SUPABASE_AUTH_KEY = 'sb-localhost-auth-token';
  
  /**
   * Check if user has a stored authentication session
   */
  static async hasStoredSession(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter(key => 
        key.includes('auth-token') || 
        key.includes('supabase') ||
        key.includes('session')
      );
      return authKeys.length > 0;
    } catch (error) {
      console.error('Error checking stored session:', error);
      return false;
    }
  }

  /**
   * Get all stored authentication-related keys (for debugging)
   */
  static async getAuthKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => 
        key.includes('auth-token') || 
        key.includes('supabase') ||
        key.includes('session')
      );
    } catch (error) {
      console.error('Error getting auth keys:', error);
      return [];
    }
  }

  /**
   * Clear all authentication data (for debugging/logout)
   */
  static async clearAuthData(): Promise<void> {
    try {
      const authKeys = await this.getAuthKeys();
      await AsyncStorage.multiRemove(authKeys);
      console.log('🗑️ Cleared authentication data:', authKeys);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Get session info for debugging
   */
  static async getSessionInfo(): Promise<any> {
    try {
      const authKeys = await this.getAuthKeys();
      const sessionData: any = {};
      
      for (const key of authKeys) {
        const value = await AsyncStorage.getItem(key);
        sessionData[key] = value ? JSON.parse(value) : null;
      }
      
      return sessionData;
    } catch (error) {
      console.error('Error getting session info:', error);
      return {};
    }
  }

  /**
   * Check if session is expired
   */
  static isSessionExpired(expiresAt: number): boolean {
    return Date.now() / 1000 > expiresAt;
  }
}
