import { createRealmContext } from '@realm/react';
import { schemas } from './schemas';

/**
 * Creates the Realm Context using the schemas.
 * The context provides hooks like useRealm, useQuery, and the RealmProvider.
 */
export const { RealmProvider, useRealm, useQuery, useObject } = createRealmContext({
  schema: schemas,
  schemaVersion: 1,
  // We don't set encryptionKey here statically.
  // We will pass the encryptionKey prop dynamically to the <RealmProvider> when we mount it.
});
