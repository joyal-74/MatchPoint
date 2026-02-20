import { Landmark, Smartphone, Trash2, ShieldCheck, Plus } from "lucide-react";
import type { PayoutMethod } from "../../../features/shared/wallet/walletTypes";



interface PayoutMethodsProps {
    methods: PayoutMethod[];
    onDelete: (id: string) => void;
    onAddNew: (status: boolean) => void;
}

export const PayoutMethods = ({ methods, onDelete, onAddNew }: PayoutMethodsProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">Payout Methods</h3>
                <button
                    onClick={() => onAddNew(true)}
                    className="text-primary text-xs font-extrabold hover:underline flex items-center gap-1"
                >
                    <Plus size={14} /> Add New
                </button>
            </div>

            <div className="space-y-3">
                {methods.length > 0 ? (
                    methods.map((method) => (
                        <div key={method._id} className="p-4 bg-card border border-border rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                    {method.type === 'bank' ? <Landmark size={22} /> : <Smartphone size={22} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{method.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono tracking-tight">{method.detail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {method.isPrimary && (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Primary</span>
                                )}
                                <button
                                    onClick={() => onDelete(method._id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center">
                        <p className="text-xs text-muted-foreground">No payout methods saved.</p>
                        <button onClick={() => onAddNew(true)} className="text-primary text-xs font-bold mt-2">Add your first account</button>
                    </div>
                )}
            </div>

            <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl flex gap-4">
                <ShieldCheck className="text-primary shrink-0" size={20} />
                <p className="text-[11px] text-muted-foreground leading-tight italic">
                    All payout details are encrypted. Your bank details are used only for outgoing transfers.
                </p>
            </div>
        </div>
    );
};