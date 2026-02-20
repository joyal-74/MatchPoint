import { ChevronRight, type LucideIcon } from "lucide-react";

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label: string;
    icon?: LucideIcon;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    error?: string;
}

export const FormSelect = ({ icon: Icon, label, options, onChange, error, ...props }: FormSelectProps) => {
    // 1. Force the check for a valid value
    const hasValue = props.value !== undefined && props.value !== "";
    const isValid = !error && hasValue;

    return (
        <div className="space-y-1.5 w-full group">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors
                ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors 
                    ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground'}`} />}
                
                <select
                    {...props}
                    // 2. Explicitly bind the value to ensure it's controlled
                    value={props.value || ""} 
                    className={`w-full h-12 md:h-14 bg-background border rounded-xl appearance-none cursor-pointer outline-none transition-all text-sm
                        ${Icon ? 'pl-11' : 'px-4'} pr-10
                        ${error ? 'border-destructive' : isValid ? 'border-green-500' : 'border-input focus:ring-2 focus:ring-primary'}
                        ${!hasValue ? 'text-muted-foreground' : 'text-foreground'}`}
                    onChange={(e) => {
                        console.log(`Select Changed: ${label} ->`, e.target.value); // Debug log
                        onChange(e.target.value);
                    }}
                >
                    {/* 3. Placeholder option */}
                    <option value="" disabled>Select {label}</option>
                    
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-foreground">
                            {opt.label}
                        </option>
                    ))}
                </select>

                <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none rotate-90 transition-colors
                    ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground'}`} />
            </div>
            {error && <p className="text-[10px] text-destructive font-bold ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
    );
};