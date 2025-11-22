import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function Transaction() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "entrada" as "entrada" | "saida",
        optional: false,
        value: "",
        description: "",
        inCash: true,
        months: "",
        date: ""
    });

    // Formata o valor para exibição (centavos -> R$ X.XXX,XX)
    const formatCurrency = (cents: string): string => {
        if (!cents || cents === "") return "";
        const numericValue = cents.replace(/\D/g, ""); // Remove tudo que não é número
        if (numericValue === "") return "";
        
        const valueInCents = parseInt(numericValue);
        const reais = Math.floor(valueInCents / 100);
        const centavos = valueInCents % 100;
        
        // Formata os reais com separador de milhar
        const reaisFormatted = reais.toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        return `${reaisFormatted},${centavos.toString().padStart(2, "0")}`;
    };

    // Converte o valor formatado de volta para centavos
    const parseCurrencyToCents = (formattedValue: string): number => {
        if (!formattedValue || formattedValue === "") return 0;
        const numericValue = formattedValue.replace(/\D/g, ""); // Remove tudo que não é número
        return parseInt(numericValue) || 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        if (name === "value") {
            // Para o campo de valor, armazena os centavos (apenas números)
            const numericValue = value.replace(/\D/g, "");
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else if (name === "type") {
            // Quando mudar o tipo, se for entrada, garante que optional seja false
            setFormData(prev => ({
                ...prev,
                [name]: value as "entrada" | "saida",
                optional: value === "entrada" ? false : prev.optional
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações
        if (!formData.date) {
            alert('Por favor, informe a data da transação.');
            return;
        }

        if (!formData.description.trim()) {
            alert('Por favor, informe uma descrição.');
            return;
        }

        // Converter os dados para o formato esperado pelo backend
        const valueInCents = parseCurrencyToCents(formData.value);
        if (valueInCents === 0) {
            alert('Por favor, informe um valor válido.');
            return;
        }

        if (!formData.inCash && (!formData.months || parseInt(formData.months) < 1)) {
            alert('Por favor, informe o número de meses (mínimo 1).');
            return;
        }

        setIsLoading(true);

        try {
            // Buscar userId do localStorage (salvo ao criar usuário)
            let userId: string | null = localStorage.getItem('userId');
            
            // Se não tiver no localStorage, tenta buscar das transações existentes
            if (!userId) {
                try {
                    const transactionsRes = await fetch('http://127.0.0.1:8080/api/transaction');
                    if (transactionsRes.ok) {
                        const transactions = await transactionsRes.json();
                        if (transactions && transactions.length > 0) {
                            userId = String(transactions[0].userId);
                            // Salva no localStorage para próximas vezes
                            localStorage.setItem('userId', userId);
                        }
                    }
                } catch (err) {
                    console.error('Erro ao buscar transações:', err);
                }
            }

            if (!userId) {
                alert('Erro: Nenhum usuário encontrado. Por favor, crie um usuário primeiro.');
                setIsLoading(false);
                navigate('/get-started');
                return;
            }

            const payload: {
                type: "INCOME" | "EXPENSE";
                optional: boolean;
                value: number;
                description: string;
                inCash: boolean;
                months?: number;
                date: string;
                userId: string;
            } = {
                type: formData.type === "entrada" ? "INCOME" : "EXPENSE",
                optional: formData.type === "entrada" ? false : formData.optional,
                value: valueInCents,
                description: formData.description,
                inCash: formData.inCash,
                date: formData.date,
                userId: userId
            };

            // Só adiciona months se não for à vista
            if (!formData.inCash && formData.months) {
                payload.months = parseInt(formData.months);
            }

            const res = await fetch('http://127.0.0.1:8080/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
                alert('Erro ao criar transação: ' + (errorData.message || res.status));
                setIsLoading(false);
                return;
            }

            await res.json();
            alert('Transação criada com sucesso!');
            navigate('/home');
        } catch (err) {
            console.error(err);
            alert('Erro ao conectar com o servidor');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen from-blue-50 to-indigo-100 pb-8">
            <div className="max-w-md mx-auto px-4 pt-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Voltar para Home</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Nova Transação</h1>
                    <p className="text-sm text-gray-600">Registre uma nova entrada ou saída</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Tipo de Transação */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Tipo de Transação *
                        </label>
                        <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="entrada"
                                    checked={formData.type === "entrada"}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 text-center transition-all">
                                    <span className="text-sm font-medium text-gray-700 peer-checked:text-green-700">
                                        Entrada
                                    </span>
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="saida"
                                    checked={formData.type === "saida"}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 text-center transition-all">
                                    <span className="text-sm font-medium text-gray-700 peer-checked:text-red-700">
                                        Saída
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Valor */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2">
                            Valor (R$) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                            <input
                                type="text"
                                id="value"
                                name="value"
                                value={formatCurrency(formData.value)}
                                onChange={handleChange}
                                placeholder="0,00"
                                required
                                inputMode="numeric"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Descrição *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descreva a transação..."
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Data */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                            Data da Transação *
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Dia em que a compra será efetuada</p>
                    </div>

                    {/* Forma de Pagamento */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Forma de Pagamento *
                        </label>
                        <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="inCash"
                                    value="true"
                                    checked={formData.inCash === true}
                                    onChange={() => setFormData(prev => ({ ...prev, inCash: true }))}
                                    className="sr-only peer"
                                />
                                <div className="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 text-center transition-all">
                                    <span className="text-sm font-medium text-gray-700 peer-checked:text-indigo-700">
                                        À Vista
                                    </span>
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="inCash"
                                    value="false"
                                    checked={formData.inCash === false}
                                    onChange={() => setFormData(prev => ({ ...prev, inCash: false }))}
                                    className="sr-only peer"
                                />
                                <div className="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 text-center transition-all">
                                    <span className="text-sm font-medium text-gray-700 peer-checked:text-indigo-700">
                                        A Prazo
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Número de Meses (só aparece se a prazo) */}
                    {!formData.inCash && (
                        <div className="bg-white rounded-xl shadow-sm p-4 animate-in fade-in slide-in-from-top-2">
                            <label htmlFor="months" className="block text-sm font-semibold text-gray-700 mb-2">
                                Número de Meses *
                            </label>
                            <input
                                type="number"
                                id="months"
                                name="months"
                                value={formData.months}
                                onChange={handleChange}
                                placeholder="Ex: 3"
                                min="1"
                                max="60"
                                required={!formData.inCash}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>
                    )}

                    {/* Opcional (só aparece para saída) */}
                    {formData.type === "saida" && (
                        <div className="bg-white rounded-xl shadow-sm p-4 animate-in fade-in slide-in-from-top-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="optional"
                                    checked={formData.optional}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div>
                                    <span className="text-sm font-semibold text-gray-700 block">
                                        Transação Opcional
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Se marcado, pode ser removido futuramente
                                    </span>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}