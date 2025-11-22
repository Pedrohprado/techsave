import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CirclePlus, MessageCircle } from "lucide-react";
import transactions from "@/lib/transactions";
import React from "react";
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
    const items = Object.values(transactions);
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
        // Simular resposta do agente após um pequeno delay
        setTimeout(() => {
            setMessages((s) => [...s, { id: String(Date.now() + 1), from: "agent", text: "Recebi sua mensagem — vou analisar." }]);
        }, 700);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>TechSave</CardTitle>
                    <CardDescription>Visão das transações</CardDescription>
                </CardHeader>

                <CardContent>
                    <ul className="flex flex-col gap-3">
                        {items.map((tx) => (
                            <li
                                key={tx.id}
                                className="flex items-center justify-between gap-3 px-2 py-3 rounded-md bg-white/60 shadow-sm"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{tx.description}</span>
                                    <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={
                                            "rounded-full px-3 py-1 text-xs font-semibold " +
                                            (tx.type === "entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
                                        }
                                    >
                                        {tx.type}
                                    </span>

                                    <div className="text-right">
                                        <div className="text-sm font-medium">{formatCurrency(tx.value)}</div>
                                        {tx.optional && <div className="text-xs text-muted-foreground">Opcional</div>}
                                    </div>
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
                                <DialogTitle>Converse com o agente</DialogTitle>
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
                                <div className="flex gap-2">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSend();
                                        }}
                                        className="flex-1 rounded-md border px-3 py-2"
                                        placeholder="Escreva sua mensagem..."
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="rounded-md bg-primary px-4 py-2 text-white"
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