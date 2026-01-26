import { ChevronRight, type LucideIcon } from "lucide-react";

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label: string;
    icon?: LucideIcon;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    error?: string;
}

export const FormSelect = ({ icon: Icon, label, options, onChange, error, ...props }: FormSelectProps) => {
    const isValid = !error && props.value;

    return (
        <div className="space-y-1.5 w-full group">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 
                ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors 
                    ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground'}`} />}
                <select
                    {...props}
                    className={`w-full h-12 md:h-14 bg-background border rounded-xl appearance-none cursor-pointer outline-none transition-all text-sm text-foreground
                        ${Icon ? 'pl-11' : 'px-4'} pr-10
                        ${error ? 'border-destructive' : isValid ? 'border-green-500' : 'border-input focus:ring-2 focus:ring-primary'}`}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="" disabled>Select {label}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none rotate-90 transition-colors
                    ${error ? 'text-destructive' : isValid ? 'text-green-500' : 'text-muted-foreground'}`} />
            </div>
            {error && <p className="text-[10px] text-destructive font-bold ml-1">{error}</p>}
        </div>
    );
};