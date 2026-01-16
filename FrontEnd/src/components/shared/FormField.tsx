import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
    id: string;
    label: string;
    as?: "input" | "select" | "textarea";
    options?: string[]; // Simple array for select
    error?: string;
    helperText?: string;
    startIcon?: React.ReactNode; // NEW: For the Lock icon
    endIcon?: React.ReactNode;   // NEW: For the Eye icon or Loader
    className?: string;          // Container class
    inputClassName?: string;     // Specific input class overrides
}

const FormField: React.FC<FormFieldProps> = ({
    id, label, as = "input", options = [], error, helperText,
    startIcon, endIcon, className = "w-full", inputClassName = "", 
    disabled, required, ...props 
}) => {
    
    // Base styles + Conditional styles
    const baseInputClasses = `
        w-full bg-background border rounded-xl py-3 text-sm text-foreground 
        focus:outline-none transition-all duration-200
        placeholder:text-muted-foreground/50
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    // Dynamic padding based on icons
    const paddingClasses = `
        ${startIcon ? 'pl-11' : 'pl-4'} 
        ${endIcon ? 'pr-12' : 'pr-4'}
    `;

    // State-based borders
    const stateClasses = error 
        ? "border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive" 
        : "border-input focus:border-primary focus:ring-1 focus:ring-primary";

    // Merge all classes
    const finalInputClasses = `${baseInputClasses} ${paddingClasses} ${stateClasses} ${inputClassName}`;

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-1">
                    {label} {required && <span className="text-destructive">*</span>}
                </label>
            </div>

            <div className="relative group">
                {/* Start Icon (Left) */}
                {startIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary">
                        {startIcon}
                    </div>
                )}

                {/* Input Element */}
                {as === "input" ? (
                    <input
                        id={id}
                        disabled={disabled}
                        className={finalInputClasses}
                        aria-invalid={!!error}
                        {...props}
                    />
                ) : as === "select" ? (
                    <select id={id} disabled={disabled} className={`${finalInputClasses} appearance-none`} {...props}>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : null}

                {/* End Icon (Right) */}
                {endIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {endIcon}
                    </div>
                )}
            </div>

            {/* Helpers / Errors */}
            {(helperText || error) && (
                <p className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"} animate-in slide-in-from-top-1`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export default FormField;