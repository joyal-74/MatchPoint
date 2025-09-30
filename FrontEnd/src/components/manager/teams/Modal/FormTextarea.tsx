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
        <div>
            <label className="text-sm text-white mb-1 block">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                disabled={disabled}
            />
        </div>
    );
}