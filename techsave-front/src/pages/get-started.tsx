import { useEffect, useState } from "react";
import GoalsPage from "./goals";
import type { Goal } from "../types/goals";
import { parseCurrencyToCents, formatCentsToBRL } from "../types/goals";

export function GetStarted() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [income, setIncome] = useState("");
    const [goals, setGoals] = useState<Goal[]>([]);

    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
    const isBasicFilled = name.trim() !== "" && validateEmail(email) && age.trim() !== "";

    useEffect(() => {
        if (isBasicFilled) {
            // reserved for focus or analytics
        }
    }, [isBasicFilled]);

    const percent = Math.round(((step - 1) / (totalSteps - 1)) * 100);

    const canContinueFromStep1 = isBasicFilled ? income.trim() !== "" : false;

    function nextStep() {
        setStep((s) => Math.min(totalSteps, s + 1));
    }

    function prevStep() {
        setStep((s) => Math.max(1, s - 1));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            name,
            email,
            age: Number(age) || null,
            income: parseCurrencyToCents(income) ?? null,
            goals,
        };

        alert("Dados preparados para envio:\n" + JSON.stringify(payload, null, 2));
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-sky-50 to-white flex items-start justify-center py-8 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">Vamos começar</h1>
                <p className="text-sm text-slate-500 mb-4">Preencha as informações para continuar</p>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                        className="h-2 rounded-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nome</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                placeholder="Seu nome"
                                required
                            />

                            <label className="block text-sm font-medium text-slate-700 mt-3">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                placeholder="exemplo@provedor.com"
                                required
                            />

                            <label className="block text-sm font-medium text-slate-700 mt-3">Idade</label>
                            <input
                                value={age}
                                onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                                inputMode="numeric"
                                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                placeholder="Ex: 30"
                                required
                            />

                            {isBasicFilled && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-slate-700">Renda</label>
                                    <input
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                        placeholder="Ex: R$ 3.000"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Opcional, mas necessário para continuar.</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-6">
                                <div />
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!canContinueFromStep1}
                                    className={`px-4 py-2 rounded-lg text-white font-medium ${canContinueFromStep1 ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-300 cursor-not-allowed"}`}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <GoalsPage
                            goals={goals}
                            setGoals={setGoals}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-2">Revisão</h2>
                            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm text-slate-700">
                                <div>
                                    <strong>Nome:</strong> {name || "-"}
                                </div>
                                <div>
                                    <strong>Email:</strong> {email || "-"}
                                </div>
                                <div>
                                    <strong>Idade:</strong> {age || "-"}
                                </div>
                                <div>
                                    <strong>Renda:</strong> {income || "-"}
                                </div>
                                <div>
                                    <strong>Metas:</strong>
                                    {goals.length === 0 ? (
                                        <div className="text-xs text-slate-500">Nenhuma meta selecionada</div>
                                    ) : (
                                        <ul className="mt-2 space-y-1 text-xs">
                                            {goals.map((g, i) => (
                                                <li key={i} className="flex items-center justify-between">
                                                    <span>{g.key === "outros" ? g.customLabel || "outros" : g.label}</span>
                                                      <span className="text-slate-500">{g.value != null ? formatCentsToBRL(g.value) : "sem valor"} • {g.term || "-"}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button type="button" onClick={prevStep} className="px-4 py-2 rounded-lg bg-slate-100">
                                    Voltar
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}