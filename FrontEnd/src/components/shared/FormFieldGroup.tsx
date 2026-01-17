import FormField from "./FormField";

export type FieldConfig<FormType> = {
    id: keyof FormType;
    label: string;
    type?: string;
    placeholder?: string;
    as?: "input" | "select" | "textarea";
    options?: string[];
    condition?: (formData: FormType) => boolean;
    className?: string | ((formData: FormType) => string);
    required?: boolean;
    disabled?: boolean;
};

interface FormFieldGroupProps<FormType> {
    fields: FieldConfig<FormType>[];
    formData: FormType;
    errors: Partial<Record<keyof FormType, string>>;
    handleFieldChange: (field: keyof FormType, value: string) => void;
    className?: string;
}

function FormFieldGroup<FormType extends Record<string, string>>({ fields, formData, errors, handleFieldChange, className = "", }: FormFieldGroupProps<FormType>) {
    return (
        <div className={`flex w-full gap-4 ${className}`}>
            {fields.map((field) => {
                // 1. Check Condition
                if (field.condition && !field.condition(formData)) return null;

                // 2. Safely cast value
                const value = String(formData[field.id] ?? "");

                // 3. Resolve dynamic class names
                const fieldClassName =
                    typeof field.className === "function"
                        ? field.className(formData)
                        : field.className;

                return (
                    <FormField
                        key={String(field.id)}
                        id={String(field.id)}
                        label={field.label}
                        type={field.type}
                        as={field.as}
                        options={field.options}
                        value={value}
                        placeholder={field.placeholder}
                        // Bridge the Event -> Value gap
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={fieldClassName}
                        error={errors[field.id]}
                        required={field.required}
                        disabled={field.disabled}
                    />
                );
            })}
        </div>
    );
}

export default FormFieldGroup;