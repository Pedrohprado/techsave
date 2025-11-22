import GoalsSelector from "../components/GoalsSelector";
import type { Goal } from "../types/goals";

type Props = {
  goals: Goal[];
  setGoals: (g: Goal[]) => void;
  onNext?: () => void;
  onPrev?: () => void;
};

export function GoalsPage({ goals, setGoals, onNext, onPrev }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Qual sua meta?</h2>
      <p className="text-sm text-slate-500 mb-4">Escolha um ou mais objetivos e, se quiser, adicione valor e prazo.</p>

      <GoalsSelector
        value={goals}
        onChange={(g) => {
          setGoals(g);
        }}
      />

      <div className="flex items-center justify-between mt-6">
        <button type="button" onClick={onPrev} className="px-4 py-2 rounded-lg bg-slate-100">
          Voltar
        </button>
        <button type="button" onClick={onNext} className="px-4 py-2 rounded-lg bg-emerald-500 text-white">
          Continuar
        </button>
      </div>
    </div>
  );
}

export default GoalsPage;
