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
        <div>
            <label className="text-sm text-white mb-1 block">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
                required={required}
                disabled={disabled}
                min={min}
                max={max}
            />
        </div>
    );
}