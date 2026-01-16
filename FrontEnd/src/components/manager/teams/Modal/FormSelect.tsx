import { ChevronDown } from "lucide-react";

interface FormSelectProps {
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    disabled?: boolean;
}

export default function FormSelect({
    label,
    value,
    onChange,
    placeholder,
    options,
    disabled = false
}: FormSelectProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 appearance-none
                        bg-background border border-input text-foreground
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                        disabled:cursor-not-allowed disabled:opacity-50
                        pr-10
                    `}
                    disabled={disabled}
                >
                    <option value="" disabled className="text-muted-foreground">
                        {placeholder}
                    </option>

                    {options.map(option => (
                        <option key={option.value} value={option.value} className="bg-background text-foreground">
                            {option.label}
                        </option>
                    ))}
                </select>
                
                {/* Custom Arrow Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );
}