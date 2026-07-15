import * as Keychain from 'react-native-keychain';
import * as Crypto from 'expo-crypto';

const REALM_KEY_SERVICE = 'com.thiqaty.app.realmKey';
const ENCRYPTION_OPTIONS: any = {
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
};

/**
 * Generates a strong 64-byte random key for Realm AES-256 encryption.
 */
function generateRealmKey(): Uint8Array {
  return Crypto.getRandomBytes(64);
}

/**
 * Converts a Uint8Array to a hex string to store in the Keychain.
 */
function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a hex string back to a Uint8Array.
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Retrieves the stored Realm encryption key from Keychain.
 * If it doesn't exist (first launch), generates a new one, stores it securely, and returns it.
 */
export async function getOrInitializeRealmKey(): Promise<Int8Array> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: REALM_KEY_SERVICE });

    if (credentials) {
      // Key exists, parse it and return as Int8Array for Realm
      const keyBuffer = hexToBuffer(credentials.password);
      return new Int8Array(keyBuffer.buffer);
    } else {
      // First launch: generate new key
      console.log('Generating new Realm encryption key...');
      const newKey = generateRealmKey();
      const hexKey = bufferToHex(newKey);

      // Store in Keychain
      await Keychain.setGenericPassword('realm-user', hexKey, {
        service: REALM_KEY_SERVICE,
        ...ENCRYPTION_OPTIONS,
      });

      return new Int8Array(newKey.buffer);
    }
  } catch (error) {
    console.error('Failed to access Keychain for Realm key:', error);
    throw new Error('Secure storage is unavailable. Cannot initialize database.');
  }
}
