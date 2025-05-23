// types.ts

export interface User {
  id: string; // UUID
  email: string;
  auth_provider: string;
}

export interface Account {
  id: string; // UUID
  user_id: string; // UUID
  name: string;
  type: string;
  balance: number;
}

export interface CategoryGroup {
  id: string; // UUID
  user_id: string; // UUID
  name: string;
}

export interface Category {
  id: string; // UUID
  user_id: string; // UUID
  group_id: string; // UUID (CategoryGroup.id)
  name: string;
  month: number;
  year: number;
  budgeted_amount: number;
  activity: number;
  available?: number;
}

export interface Transaction {
  id: string; // UUID
  user_id: string; // UUID
  account_id: string; // UUID
  category_id: string; // UUID
  amount: number;
  payee?: string | null;
  memo?: string | null;
  date: string; // ISO date format (YYYY-MM-DD)
  cleared: boolean;
}