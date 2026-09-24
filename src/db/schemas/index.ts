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

export class Task extends Realm.Object<Task> {
  id!: string;
  title!: string;
  dateTime!: Date;
  notificationId?: string;
  notified!: boolean;
  done!: boolean;

  static schema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      dateTime: 'date',
      notificationId: 'string?',
      notified: 'bool',
      done: 'bool',
    },
  };
}

export type NoteCategory = 'Interview Prep' | 'Exam Prep' | 'Company' | 'Freelance' | 'Personal' | 'General';

export class Note extends Realm.Object<Note> {
  id!: string;
  title!: string;
  body!: string;
  category!: NoteCategory;
  createdAt!: Date;

  static schema = {
    name: 'Note',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      body: 'string',
      category: 'string',
      createdAt: 'date',
    },
  };
}

export class Attachment extends Realm.Object<Attachment> {
  id!: string;
  fileName!: string;
  mimeType!: string;
  encryptedFilePath!: string;
  sizeBytes!: number;
  linkedToId!: string;
  addedAt!: Date;

  static schema = {
    name: 'Attachment',
    primaryKey: 'id',
    properties: {
      id: 'string',
      fileName: 'string',
      mimeType: 'string',
      encryptedFilePath: 'string',
      sizeBytes: 'int',
      linkedToId: 'string',
      addedAt: 'date',
    },
  };
}

export class FinanceEntry extends Realm.Object<FinanceEntry> {
  id!: string;
  type!: 'income' | 'expense';
  amount!: number;
  category!: string;
  date!: Date;
  note?: string;

  static schema = {
    name: 'FinanceEntry',
    primaryKey: 'id',
    properties: {
      id: 'string',
      type: 'string',
      amount: 'double',
      category: 'string',
      date: 'date',
      note: 'string?',
    },
  };
}

export class Category extends Realm.Object<Category> {
  id!: string;
  name!: string;
  type!: 'finance';
  color!: string;

  static schema = {
    name: 'Category',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      type: 'string',
      color: 'string',
    },
  };
}

export class LinkContact extends Realm.Object<LinkContact> {
  id!: string;
  label!: string;
  type!: 'email' | 'phone' | 'link';
  value!: string;

  static schema = {
    name: 'LinkContact',
    primaryKey: 'id',
    properties: {
      id: 'string',
      label: 'string',
      type: 'string',
      value: 'string',
    },
  };
}

export class VaultEntry extends Realm.Object<VaultEntry> {
  id!: string;
  title!: string;
  username!: string;
  encryptedPassword!: string;
  notes?: string;

  static schema = {
    name: 'VaultEntry',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      username: 'string',
      encryptedPassword: 'string',
      notes: 'string?',
    },
  };
}

export const schemas = [
  User,
  Task,
  Note,
  Attachment,
  FinanceEntry,
  Category,
  LinkContact,
  VaultEntry,
];
