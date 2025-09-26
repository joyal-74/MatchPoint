import FormField from "./FormField";

export type FieldConfig<FormType> = {
    id: keyof FormType;
    label: string;
    type?: string;
    placeholder?: string;
    as?: "input" | "select";
    options?: string[];
    condition?: (formData: FormType) => boolean;
    className?: string | ((formData: FormType) => string);
};

interface FormFieldGroupProps<FormType> {
    fields: FieldConfig<FormType>[];
    formData: FormType;
    errors: Partial<Record<keyof FormType, string>>;
    handleFieldChange: (field: keyof FormType, value: string) => void;
}

function FormFieldGroup<FormType extends { [K in keyof FormType]: unknown }>({
    fields,
    formData,
    errors,
    handleFieldChange,
}: FormFieldGroupProps<FormType>) {
    return (
        <div className="flex space-x-3 text-sm w-full">
            {fields.map((field) => {
                if (field.condition && !field.condition(formData)) return null;

                const value = String(formData[field.id] ?? "");

                const onChange = (val: string) => handleFieldChange(field.id, val);

                const className =
                    typeof field.className === "function" ? field.className(formData) : field.className;

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
                        onChange={(e) => onChange(e.target.value)}
                        className={className}
                        error={errors[field.id]}
                    />
                );
            })}
        </div>
    );
}

export default FormFieldGroup;