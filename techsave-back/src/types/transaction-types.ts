export type CreateTransaction = {
  type: "INCOME" | "EXPENSE";
  optional: boolean;
  value: number;
  description?: string;
  inCash: boolean;
  months?: number;
  date: Date;
  userId: string;
};
