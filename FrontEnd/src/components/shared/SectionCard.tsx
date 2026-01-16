import { ChevronDown } from "lucide-react";

export const SectionCard = ({ title, icon, description, children, isOpen, onToggle }: { 
    title: string; icon: React.ReactNode; description?: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; 
}) => (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <button type="button" onClick={onToggle} className="w-full p-6 border-b border-border bg-muted/20 flex items-center justify-between hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
                <div className="text-left">
                    <h2 className="text-lg font-bold text-foreground">{title}</h2>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                </div>
            </div>
            <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 md:p-8">{children}</div>
        </div>
    </div>
);