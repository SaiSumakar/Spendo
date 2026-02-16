// transaction.types.ts

/* ----------------------------- */
/* ENUM — must match backend     */
/* ----------------------------- */

export const ExpenseType = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type ExpenseType = typeof ExpenseType[keyof typeof ExpenseType];

/* ----------------------------- */
/* API Transaction Shape         */
/* (what server returns)         */
/* ----------------------------- */

export interface Transaction {
  id: string;

  // decimal comes over JSON as string sometimes — keep safe
  amount: number | string;

  type: ExpenseType;

  description: string;

  category?: string | null;

  notes?: string | null;

  // Nest date column returns ISO string
  date: string;

  subscriptionId?: string | null;

  subscription?: {
    id: string;
    name: string;
  } | null;

  userId: string;

  createdAt: string;
  updatedAt: string;
}

/* ----------------------------- */
/* CREATE DTO — what frontend sends */
/* ----------------------------- */

export interface CreateTransactionDto {
  amount: number;

  type: ExpenseType;

  description: string;

  category?: string;

  notes?: string;

  // send as ISO string — safest for Nest validation
  date: string;

  subscriptionId?: string | null;
}

/* ----------------------------- */
/* UPDATE DTO                    */
/* ----------------------------- */

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

/* ----------------------------- */
/* Form Values (UI layer only)   */
/* allows strings from inputs    */
/* ----------------------------- */

export interface TransactionFormValues {
  amount: string;
  type: ExpenseType;
  description: string;
  category?: string;
  notes?: string;
  date: Date;
  subscriptionId?: string;
}
