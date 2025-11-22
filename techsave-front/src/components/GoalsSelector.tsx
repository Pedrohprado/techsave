import  { useEffect, useState } from "react";
import { Home, Car, Plane, Wallet, Plus } from "lucide-react";
import type { Goal } from "../types/goals";
import { parseCurrencyToCents } from "../types/goals";

type Term = "curto" | "medio" | "longo";

export type GoalItem = {
  key: string;
  label: string;
  customLabel?: string;
  // internal value may be string while editing, or number after mapping
  value?: string | number | null;
  term?: Term | null;
};

type Props = {
  value?: GoalItem[];
  onChange?: (goals: Goal[]) => void;
};

const ICONS: Record<string, React.ReactNode> = {
  casa: <Home className="w-6 h-6" />,
  carro: <Car className="w-6 h-6" />,
  viagem: <Plane className="w-6 h-6" />,
  reserva: <Wallet className="w-6 h-6" />,
  outros: <Plus className="w-6 h-6" />,
};

const DEFAULT_GOALS = [
  { key: "casa", label: "casa" },
  { key: "carro", label: "carro" },
  { key: "viagem", label: "viagem" },
  { key: "reserva", label: "reserva" },
  { key: "outros", label: "outros" },
];

export function GoalsSelector({ value = [], onChange }: Props) {
  const [selected, setSelected] = useState<Record<string, GoalItem>>(() => {
    const map: Record<string, GoalItem> = {};
    (value || []).forEach((g) => (map[g.key] = { ...g }));
    return map;
  });

  useEffect(() => {
    if (!onChange) return;
    // convert the UI state (value as string) into a payload where value is in cents (number|null)
    const mapped = Object.values(selected).map((s) => {
      const parsedValue = parseCurrencyToCents(s.value as any);
      const mappedGoal: Goal = {
        key: s.key,
        label: s.label ?? s.customLabel ?? s.key,
        customLabel: s.customLabel,
        value: parsedValue,
        term: s.term ?? null,
      };
      return mappedGoal;
    });
    onChange(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function toggleKey(key: string) {
    setSelected((s) => {
      const next = { ...s };
      if (next[key]) delete next[key];
      else next[key] = { key, label: key, term: null };
      return next;
    });
  }

  function setCustomLabel(key: string, label: string) {
    setSelected((s) => ({ ...s, [key]: { ...(s[key] || { key }), customLabel: label, label } }));
  }

  function setValueFor(key: string, val: string) {
    setSelected((s) => ({ ...s, [key]: { ...(s[key] || { key }), value: val } }));
  }

  function setTermFor(key: string, term: Term) {
    setSelected((s) => ({ ...s, [key]: { ...(s[key] || { key }), term } }));
  }

  const selectedList = Object.values(selected);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {DEFAULT_GOALS.map((g) => {
          const active = !!selected[g.key];
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => toggleKey(g.key)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${
                active ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className={`text-slate-700 ${active ? "text-emerald-600" : ""}`}>
                {ICONS[g.key]}
              </div>
              <div className="text-xs lowercase text-slate-600">{g.label}</div>
            </button>
          );
        })}
      </div>

      {selectedList.length > 0 && (
        <div className="mt-4 space-y-4">
          {selectedList.map((s) => (
            <div key={s.key} className="p-3 border rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-slate-700">{ICONS[s.key]}</div>
                  <div className="text-sm font-medium">
                    {s.key === "outros" ? s.customLabel || "outros" : s.label}
                  </div>
                </div>
                <div className="text-xs text-slate-500">Opcional</div>
              </div>

              {s.key === "outros" && (
                <div className="mt-3">
                  <input
                    placeholder="Descreva seu objetivo"
                    value={s.customLabel || ""}
                    onChange={(e) => setCustomLabel(s.key, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
              )}

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  placeholder="Valor (R$)"
                  value={s.value || ""}
                  onChange={(e) => setValueFor(s.key, e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTermFor(s.key, "curto")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                      s.term === "curto"
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    Curto (≤2 anos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTermFor(s.key, "medio")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                      s.term === "medio"
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    Médio (3–9 anos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTermFor(s.key, "longo")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                      s.term === "longo"
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    Longo (≥10 anos)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GoalsSelector;
