import React from "react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    icon?: LucideIcon;
    onChange: (value: string) => void;
    error?: string;
}

export const FormInput = ({ icon: Icon, label, onChange, error, className, ...props }: FormInputProps) => {
    // A field is considered "valid" (green) if there is no error and the user has typed something
    const isValid = !error && props.value && props.value.toString().length > 0;

    return (
        <div className="space-y-1.5 w-full group">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors 
                ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground group-focus-within:text-primary'}`}>
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors 
                        ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground group-focus-within:text-primary'}`} 
                    />
                )}
                <input
                    {...props}
                    className={`w-full h-12 md:h-14 bg-background border rounded-xl shadow-sm outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/50
                        ${Icon ? 'pl-11' : 'px-4'} pr-4
                        ${error 
                            ? 'border-destructive focus:ring-2 focus:ring-destructive/20' 
                            : isValid 
                                ? 'border-green-500 focus:ring-2 focus:ring-green-500/20' 
                                : 'border-input focus:ring-2 focus:ring-primary'
                        } 
                        ${className}`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                />
            </div>
            {error && (
                <p className="text-[10px] text-destructive font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};