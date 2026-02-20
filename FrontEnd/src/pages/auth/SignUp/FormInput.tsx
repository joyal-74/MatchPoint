import React, { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    icon?: LucideIcon;
    type?: string;
    onChange: (value: string) => void;
    error?: string;
}

export const FormInput = ({ icon: Icon, label, type, onChange, error, className, ...props }: FormInputProps) => {
    const isValid = !error && props.value && props.value.toString().length > 0;
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    
    const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-1.5 w-full group">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors 
                ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground group-focus-within:text-primary'}`}>
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-10
                        ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground group-focus-within:text-primary'}`} 
                    />
                )}
                
                <input
                    {...props}
                    type={inputType}
                    className={`w-full h-12 md:h-14 bg-background border rounded-xl shadow-sm outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/50
                        ${Icon ? 'pl-11' : 'px-4'} 
                        ${isPasswordField ? 'pr-11' : 'pr-4'}
                        ${error 
                            ? 'border-destructive focus:ring-2 focus:ring-destructive/20' 
                            : isValid 
                                ? 'border-green-500 focus:ring-2 focus:ring-green-500/20' 
                                : 'border-input focus:ring-2 focus:ring-primary'
                        } 
                        ${className}`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                />

                {/* Password Toggle Button */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            
            {error && (
                <p className="text-[10px] text-destructive font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};