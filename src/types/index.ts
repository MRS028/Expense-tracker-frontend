export interface User {
  username: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  owner_id: number;
}

export interface TransactionInput {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export interface FilterParams {
  type?: string;
  category?: string;
  minimum_amount?: string;
  maximum_amount?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}