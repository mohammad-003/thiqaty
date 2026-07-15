import CryptoJS from 'crypto-js';
import * as LocalAuthentication from 'expo-local-authentication';

// A static salt used across the app since it's a single-user local app.
// In a server-based app, we'd generate this per user, but here we just need to protect the PIN on disk.
const PIN_SALT = 'Thiqaty_v1_Local_Salt_893248239';

/**
 * Hashes a PIN using PBKDF2 (HMAC-SHA256).
 * Uses 100,000 iterations for strong protection against brute force.
 */
export function hashPin(pin: string): string {
  const key512Bits = CryptoJS.PBKDF2(pin, PIN_SALT, {
    keySize: 512 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256,
  });
  return key512Bits.toString(CryptoJS.enc.Hex);
}

/**
 * Verifies a given PIN against the stored hash.
 */
export function verifyPin(pin: string, storedHash: string): boolean {
  const hash = hashPin(pin);
  return hash === storedHash;
}

/**
 * Prompts the OS biometric unlock.
 * Returns true if successful, false otherwise.
 */
export async function promptBiometric(promptMessage: string = 'Unlock Thiqaty'): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    disableDeviceFallback: true, // Force biometric or cancel (we handle fallback manually via PIN)
    cancelLabel: 'Use PIN',
  });

  return result.success;
}
