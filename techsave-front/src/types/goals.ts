export type GoalTerm = "curto" | "medio" | "longo";

export type GoalKey = "casa" | "carro" | "viagem" | "reserva" | "outros" | string;

export interface Goal {
  key: GoalKey;
  label: string;
  customLabel?: string;
  // value in cents (integer). null when not provided.
  value?: number | null;
  term?: GoalTerm | null;
  metaId?: string;
}

/**
 * Parse currency-like strings to centavos (integer).
 * Accepts formats like:
 *  - "3000" -> 300000
 *  - "3.000" -> 300000
 *  - "3.000,50" -> 300050
 *  - "3000.50" -> 300050
 *  - "R$ 3.000,50" -> 300050
 */
export function parseCurrencyToCents(raw?: string | null): number | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (str === "") return null;

  // remove currency symbols and spaces
  let cleaned = str.replace(/[R$\s]/gi, "");

  // If contains both '.' and ',' assume '.' thousand separator and ',' decimal (pt-BR)
  if (cleaned.includes(".") && cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",") && !cleaned.includes(".")) {
    // only comma -> treat as decimal separator
    cleaned = cleaned.replace(/,/g, ".");
  } else {
    // only dots or plain digits -> keep (dots may be decimal in en-US)
    // leave as-is
  }

  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;
  return Math.round(num * 100);
}

export function mapUiGoalsToApi(goalsUi: Array<any>): Goal[] {
  return goalsUi.map((g) => {
    const rawValue = g.value ?? null;
    const value = typeof rawValue === "number" ? Math.round(rawValue) : parseCurrencyToCents(String(rawValue || ""));

    return {
      key: g.key,
      label: g.label ?? g.customLabel ?? g.key,
      customLabel: g.customLabel,
      value: value,
      term: g.term ?? null,
      metaId: g.metaId ?? undefined,
    } as Goal;
  });
}

export function formatCentsToBRL(cents?: number | null): string | null {
  if (cents === null || cents === undefined) return null;
  const reais = cents / 100;
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(reais);
  } catch {
    // fallback
    return `R$ ${reais.toFixed(2)}`;
  }
}
