import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CirclePlus, MessageCircle, User, X } from "lucide-react";
import React from "react";
import type { Transaction } from "@/lib/transactions";
import {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

function formatCurrency(cents: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatDate(d: Date) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d));
}

export function Home() {
    const [items, setItems] = React.useState<Transaction[]>(() => Object.values([] as unknown as Record<string, Transaction>));
    const [month, setMonth] = React.useState<string>(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        return `${y}-${m}`;
    });

    const API_BASE = ((import.meta.env.VITE_API_URL as string) ?? "http://127.0.0.1:3000") + "/api";

    async function loadTransactions(monthQuery?: string) {
        try {
            const qs = monthQuery ? `?month=${encodeURIComponent(monthQuery)}` : "";
            const res = await fetch(`${API_BASE}/transaction${qs}`);
            if (!res.ok) {
                console.error("Erro ao buscar transactions", res.statusText);
                return;
            }
            const data = await res.json();
            const mapped: Transaction[] = data.map((d: any) => ({
                id: d.id,
                type: d.type === "INCOME" ? "entrada" : "saida",
                optional: d.optional,
                value: d.value,
                description: d.description || "",
                inCash: d.inCash,
                months: d.months ?? undefined,
                date: new Date(d.date),
                createdAt: new Date(d.createdAt),
            }));
            setItems(mapped);
        } catch (err) {
            console.error(err);
        }
    }

    React.useEffect(() => {
        void loadTransactions(month);
    }, [month]);
    const [open, setOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<Array<{ id: string; from: string; text: string }>>([
        { id: "m1", from: "agent", text: "Olá! Em que posso ajudar hoje?" },
    ]);
    const [input, setInput] = React.useState("");

    function handleSend() {
        if (!input.trim()) return;
        const msg = { id: String(Date.now()), from: "user", text: input.trim() };
        setMessages((s) => [...s, msg]);
        setInput("");
        setTimeout(() => {
            setMessages((s) => [...s, { id: String(Date.now() + 1), from: "agent", text: "Recebi sua mensagem — vou analisar." }]);
        }, 700);
    }

    const userName = "Vanderlei";
    const balanceCents = items.reduce((acc, t) => acc + (t.type === "entrada" ? t.value : -t.value), 0);
    const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${month}-01`));

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary p-2 text-white">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Olá, {userName}</span>
                            <span className="text-xs text-muted-foreground">Bem-vindo de volta</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-sm text-muted-foreground">{monthLabel}</span>
                        <span className="text-lg font-semibold">{formatCurrency(balanceCents)}</span>
                    </div>
                </div>

                <CardHeader>
                    <CardTitle>TechSave</CardTitle>
                    <CardDescription>Visão das transações</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                        <label className="text-xs text-muted-foreground">Mês:</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="rounded-md border px-2 py-1"
                        />
                    </div>
                    <ul className="flex flex-col gap-3">
                        {items.map((tx) => (
                            <li
                                key={tx.id}
                                className="flex items-center justify-between gap-3 px-2 py-3 rounded-md bg-white/60 shadow-sm w-full overflow-hidden"
                            >
                                <div className="flex flex-col min-w-0">
                                    <span className="group relative text-sm font-medium truncate" title={tx.description}>
                                        {tx.description}
                                        <span className="pointer-events-none absolute left-0 -bottom-8 hidden group-hover:block z-10 max-w-xs truncate whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white shadow">
                                            {tx.description}
                                        </span>
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">{formatDate(tx.date)}</span>
                                </div>

                                <div className="flex flex-col items-end gap-1 shrink-0 w-24 sm:w-32">
                                    <div className="text-sm font-medium truncate">{formatCurrency(tx.value)}</div>

                                    <span
                                        className={
                                            "inline-block rounded-full px-2 py-1 text-xs font-semibold text-center whitespace-nowrap " +
                                            (tx.type === "entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
                                        }
                                    >
                                        {tx.type}
                                    </span>

                                    {tx.optional && <div className="text-xs text-muted-foreground">Opcional</div>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <div className="flex justify-between gap-2 p-4">
                    <CardFooter>
                        <button className="inline-flex items-center gap-2 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                            Adicionar gastos
                            <CirclePlus />
                        </button>
                    </CardFooter>
                    <CardFooter>
                        <button
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                        >
                            <MessageCircle />
                        </button>
                    </CardFooter>
                </div>
            </Card>
            {open && (
                <Dialog>
                    <DialogOverlay onClick={() => setOpen(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <DialogContent>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <DialogTitle>Converse com o agente</DialogTitle>
                                    <button
                                        onClick={() => setOpen(false)}
                                        aria-label="Fechar chat"
                                        className="rounded-md p-1 hover:bg-gray-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </DialogHeader>
                            <DialogDescription>
                                <div className="flex flex-col gap-3 max-h-64 overflow-auto">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={
                                                "p-2 rounded-md max-w-[80%] " +
                                                (m.from === "user" ? "self-end bg-primary text-white" : "self-start bg-gray-100 text-black")
                                            }
                                        >
                                            {m.text}
                                        </div>
                                    ))}
                                </div>
                            </DialogDescription>

                            <div className="px-4 pb-4 pt-2">
                                <div className="flex gap-2 items-center">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSend();
                                        }}
                                        className="flex-1 min-w-0 rounded-md border px-3 py-2"
                                        placeholder="Escreva sua mensagem..."
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="rounded-md bg-primary sm:px-4 px-3 py-2 text-white whitespace-nowrap"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </div>
                        </DialogContent>
                    </div>
                </Dialog>
            )}
        </div>
    );
}