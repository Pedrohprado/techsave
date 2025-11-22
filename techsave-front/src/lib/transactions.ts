export type TransactionType = "entrada" | "saida";

export interface Transaction {
  id: string;
  type: TransactionType;
  optional?: boolean; // Se for true, futuramente ele pode ser removido
  value: number; // centavos
  description: string;
  inCash: boolean; // à vista (true) ou a prazo (false)
  months?: number; // caso inCash seja false, número de meses
  date: Date; // data que a transação ocorrerá
  createdAt: Date;
}

export const transactions: Record<string, Transaction> = {
  tx_001: {
    id: "tx_001",
    type: "entrada",
    optional: false,
    value: 500000, // R$5.000,00
    description: "Salário mensal",
    inCash: true,
    date: new Date("2025-11-30"),
    createdAt: new Date("2025-11-01T09:00:00Z"),
  },

  tx_002: {
    id: "tx_002",
    type: "saida",
    optional: false,
    value: 150000, // R$1.500,00
    description: "Aluguel",
    inCash: false,
    months: 12,
    date: new Date("2025-12-05"),
    createdAt: new Date("2025-11-02T10:30:00Z"),
  },

  tx_003: {
    id: "tx_003",
    type: "saida",
    optional: true,
    value: 700, // R$7,00
    description: "Café e lanche",
    inCash: true,
    date: new Date("2025-11-22"),
    createdAt: new Date("2025-11-22T08:15:00Z"),
  },

  tx_004: {
    id: "tx_004",
    type: "saida",
    optional: false,
    value: 200000, // R$2.000,00
    description: "Compra de celular (parcelado)",
    inCash: false,
    months: 10,
    date: new Date("2025-12-15"),
    createdAt: new Date("2025-11-03T14:20:00Z"),
  },

  tx_005: {
    id: "tx_005",
    type: "entrada",
    optional: false,
    value: 120000, // R$1.200,00
    description: "Projeto freelance",
    inCash: true,
    date: new Date("2025-11-28"),
    createdAt: new Date("2025-11-04T11:45:00Z"),
  },

  tx_006: {
    id: "tx_006",
    type: "saida",
    optional: true,
    value: 2999, // R$29,99
    description: "Assinatura streaming",
    inCash: true,
    date: new Date("2025-11-25"),
    createdAt: new Date("2025-11-05T07:00:00Z"),
  },
};

export default transactions;
