import { Realm } from '@realm/react';

export class User extends Realm.Object<User> {
  id!: string;
  pinHash!: string;
  biometricEnabled!: boolean;
  autoLockMinutes!: number;
  createdAt!: Date;

  static schema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      pinHash: 'string',
      biometricEnabled: 'bool',
      autoLockMinutes: 'int',
      createdAt: 'date',
    },
  };
}

// Export array of all schemas for easy injection into the Realm config
export const schemas = [User];
