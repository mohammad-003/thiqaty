import { useCallback } from 'react';
import { useRealm, useQuery } from '@/db/realmConfig';
import { FinanceEntry, Category } from '@/db/schemas';
import { v4 as uuidv4 } from 'uuid';

export function useFinance() {
  const realm = useRealm();

  const entries = useQuery(FinanceEntry).sorted('date', true);
  const categories = useQuery(Category);

  const addEntry = useCallback((type: 'income' | 'expense', amount: number, category: string, date: Date, note?: string) => {
    realm.write(() => {
      realm.create(FinanceEntry.schema.name, {
        id: uuidv4(),
        type,
        amount,
        category,
        date,
        note,
      });
    });
  }, [realm]);

  const deleteEntry = useCallback((id: string) => {
    const entry = realm.objectForPrimaryKey<FinanceEntry>(FinanceEntry.schema.name, id);
    if (entry) {
      realm.write(() => {
        realm.delete(entry);
      });
    }
  }, [realm]);

  const addCategory = useCallback((name: string, color: string) => {
    realm.write(() => {
      realm.create(Category.schema.name, {
        id: uuidv4(),
        name,
        type: 'finance',
        color,
      });
    });
  }, [realm]);

  const deleteCategory = useCallback((id: string) => {
    const cat = realm.objectForPrimaryKey<Category>(Category.schema.name, id);
    if (cat) {
      realm.write(() => {
        realm.delete(cat);
      });
    }
  }, [realm]);

  return {
    entries,
    categories,
    addEntry,
    deleteEntry,
    addCategory,
    deleteCategory,
  };
}
