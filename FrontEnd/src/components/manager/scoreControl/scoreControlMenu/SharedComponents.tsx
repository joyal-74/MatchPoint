import { ChevronDown, X, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    label: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
}

export const SelectInput = ({ label, value, onChange, options, placeholder = "Select...", disabled = false }: SelectInputProps) => (
    <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="" disabled className="bg-popover text-muted-foreground">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-popover text-popover-foreground">
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
    </div>
);


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    icon?: LucideIcon;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal = ({ isOpen, onClose, title, children, icon: Icon, size = "md" }: ModalProps) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-card w-full ${sizeClasses[size]} rounded-2xl border border-border shadow-2xl overflow-hidden`}>
                <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                        <h3 className="font-bold text-card-foreground text-lg">{title}</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-muted/80 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-5 text-card-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
};