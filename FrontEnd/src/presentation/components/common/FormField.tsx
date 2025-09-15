import React from "react";

interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    name?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    as?: "input" | "select";
    options?: string[];
    className?: string;
    error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type = "text",
    value,
    placeholder,
    name,
    onChange,
    as = "input",
    options = [],
    className = "w-full",
    error,
}) => {
    return (
        <div className={`flex flex-col text-sm ${className}`}>
            <label htmlFor={id} className="text-sm mb-1">{label}</label>
            {as === "input" ? (
                <input
                    id={id}
                    name={name || id}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none ${error ? "border border-red-500" : "border border-transparent"
                        }`}
                />
            ) : (
                <select
                    id={id}
                    name={name || id}
                    value={value}
                    onChange={onChange}
                    className={`p-3 rounded-md bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)] focus:outline-none ${error ? "border border-red-500" : "border border-transparent"
                        }`}
                >
                    <option value="" disabled>Select {label.toLowerCase()}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

export default FormField;