import { load } from '@fingerprintjs/fingerprintjs';

// Initialize an agent at application startup.
export const getFingerprint = async (): Promise<string> => {
  // Only run on client
  if (typeof window === 'undefined') {
    return 'server-side';
  }

  try {
    const fp = await load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Error getting fingerprint:', error);
    return 'unknown-device';
  }
};

// User data interface
export interface UserData {
  name: string;
  createdAt: number;
}

// Safe localStorage wrapper
const storage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  }
};

// Save user data with fingerprint as key
export const saveUserData = async (name: string): Promise<void> => {
  try {
    const fingerprint = await getFingerprint();
    const userData: UserData = {
      name,
      createdAt: Date.now(),
    };
    storage.setItem(`resonance-user-${fingerprint}`, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Get user data using fingerprint
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const fingerprint = await getFingerprint();
    const userData = storage.getItem(`resonance-user-${fingerprint}`);
    
    if (userData) {
      return JSON.parse(userData) as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}; 