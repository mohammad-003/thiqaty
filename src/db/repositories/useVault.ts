import { useCallback } from 'react';
import { useRealm, useQuery } from '@/db/realmConfig';
import { VaultEntry } from '@/db/schemas';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Secret salt key for field-level envelope encryption
const FIELD_SECRET = 'Thiqaty_Vault_Field_Level_Key_991823719';

export function encryptVaultPassword(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, FIELD_SECRET).toString();
}

export function decryptVaultPassword(cipherText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, FIELD_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return '***';
  }
}

export function useVault() {
  const realm = useRealm();
  const entries = useQuery(VaultEntry).sorted('title');

  const addVaultEntry = useCallback((title: string, username: string, plainPassword: string, notes?: string) => {
    const encryptedPassword = encryptVaultPassword(plainPassword);
    realm.write(() => {
      realm.create(VaultEntry.schema.name, {
        id: uuidv4(),
        title,
        username,
        encryptedPassword,
        notes,
      });
    });
  }, [realm]);

  const deleteVaultEntry = useCallback((id: string) => {
    const entry = realm.objectForPrimaryKey<VaultEntry>(VaultEntry.schema.name, id);
    if (entry) {
      realm.write(() => {
        realm.delete(entry);
      });
    }
  }, [realm]);

  return {
    entries,
    addVaultEntry,
    deleteVaultEntry,
    decryptVaultPassword,
  };
}
