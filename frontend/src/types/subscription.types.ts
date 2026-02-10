const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  INR: 'INR',
  GBP: 'GBP',
} as const;

type Currency = typeof Currency[keyof typeof Currency];


const BillingFrequency = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  WEEKLY: 'WEEKLY',
} as const;

type BillingFrequency = typeof BillingFrequency[keyof typeof BillingFrequency];


export interface Subscription {
  id: string;
  name: string;
  // TypeORM returns decimals as strings to preserve precision
  price: string; 
  currency: Currency;
  frequency: BillingFrequency;
  category?: string;
  startDate: string;      // ISO Date String (YYYY-MM-DD)
  nextBillingDate: string; // ISO Date String (YYYY-MM-DD)
  websiteUrl?: string;
  isTrial: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a new subscription (omit system generated fields)
export type CreateSubscriptionDto = Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'nextBillingDate'>;

// DTO for updating (everything is optional)
export type UpdateSubscriptionDto = Partial<CreateSubscriptionDto>;