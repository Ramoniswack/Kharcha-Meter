import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage adapter that works on both web and mobile
class StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } else {
      // Use AsyncStorage for mobile
      return await AsyncStorage.getItem(key);
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } else {
      // Use AsyncStorage for mobile
      await AsyncStorage.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } else {
      // Use AsyncStorage for mobile
      await AsyncStorage.removeItem(key);
    }
  }
}

export const storage = new StorageAdapter();
