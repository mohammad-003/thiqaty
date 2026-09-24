import { useCallback } from 'react';
import { useRealm, useQuery } from '@/db/realmConfig';
import { LinkContact } from '@/db/schemas';
import { v4 as uuidv4 } from 'uuid';

export function useLinksContacts() {
  const realm = useRealm();
  const items = useQuery(LinkContact).sorted('label');

  const addItem = useCallback((label: string, type: 'email' | 'phone' | 'link', value: string) => {
    realm.write(() => {
      realm.create(LinkContact.schema.name, {
        id: uuidv4(),
        label,
        type,
        value,
      });
    });
  }, [realm]);

  const deleteItem = useCallback((id: string) => {
    const item = realm.objectForPrimaryKey<LinkContact>(LinkContact.schema.name, id);
    if (item) {
      realm.write(() => {
        realm.delete(item);
      });
    }
  }, [realm]);

  return {
    items,
    addItem,
    deleteItem,
  };
}
