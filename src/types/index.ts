import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultItem {
  _id?: ObjectId;
  userId: string;
  title: string;
  username: string;
  password: string; // This will be encrypted on the client side
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultItemFormData {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  excludeLookAlikes: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
}
