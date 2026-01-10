type FormInputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';

interface FormInputProps {
    label: string;
    type?: FormInputType;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    min?: number;
    max?: number;
}

export default function FormInput({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    min,
    max
}: FormInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`
                    w-full px-3 py-2 rounded-lg text-sm transition-all duration-200
                    bg-background border border-input text-foreground
                    placeholder:text-muted-foreground/50
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    disabled:cursor-not-allowed disabled:opacity-50
                `}
                required={required}
                disabled={disabled}
                min={min}
                max={max}
            />
        </div>
    );
}