interface FormTextareaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
}

export default function FormTextarea({
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
    disabled = false
}: FormTextareaProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
                {label}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`
                    w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 resize-none
                    bg-background border border-input text-foreground
                    placeholder:text-muted-foreground/50
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    disabled:cursor-not-allowed disabled:opacity-50
                `}
            />
        </div>
    );
}