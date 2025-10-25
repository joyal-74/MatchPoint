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
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    helperText?: string;
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
    required = false,
    disabled = false,
    autoComplete,
    helperText,
}) => {
    const baseInputClasses = `
        p-3 rounded-lg bg-[var(--color-surface-raised)]/20 
        placeholder-[var(--color-text-tertiary)] 
        border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const normalStateClasses = `
        border-[var(--color-border)] 
        hover:border-[var(--color-primary)] hover:border-opacity-50
    `;

    const errorStateClasses = `
        border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-50
    `;

    const inputClasses = `
        ${baseInputClasses}
        ${error ? errorStateClasses : normalStateClasses}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    `;

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className="flex items-center justify-between">
                <label 
                    htmlFor={id} 
                    className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                
            </div>

            {as === "input" ? (
                <input
                    id={id}
                    name={name || id}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className={inputClasses}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                />
            ) : (
                <select
                    id={id}
                    name={name || id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={inputClasses}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                >
                    <option value="" disabled className="text-[var(--color-text-tertiary)]">
                        Select {label.toLowerCase()}
                    </option>
                    {options.map((opt) => (
                        <option 
                            key={opt} 
                            value={opt}
                            className="text-[var(--color-text-primary)]"
                        >
                            {opt}
                        </option>
                    ))}
                </select>
            )}

            {/* Helper Text */}
            {helperText && !error && (
                <p 
                    id={`${id}-helper`}
                    className="text-xs text-[var(--color-text-secondary)]"
                >
                    {helperText}
                </p>
            )}

            {error && (
                <p 
                    id={`${id}-error`}
                    className="text-red-500 text-xs flex items-center gap-1"
                    role="alert"
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;