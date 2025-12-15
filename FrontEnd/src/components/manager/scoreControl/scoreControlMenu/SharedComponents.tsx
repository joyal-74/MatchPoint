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
        <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-neutral-950 w-full ${sizeClasses[size as keyof typeof sizeClasses]} rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden`}>
                <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5 text-neutral-400" />}
                        <h3 className="font-bold text-white text-lg">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded-full transition-colors">
                        <X className="h-5 w-5 text-neutral-400" />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};