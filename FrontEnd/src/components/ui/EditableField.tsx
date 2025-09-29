interface EditableFieldProps {
    label: string;
    value: string;
    type?: string;
    options?: string[]; // For select inputs
    isEditing: boolean;
    onChange: (value: string) => void;
    textarea?: boolean;
    fullWidth?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    type = 'text',
    options,
    isEditing,
    onChange,
    textarea = false,
    fullWidth = false
}) => {
    const inputStyle = {
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)'
    };

    return (
        <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
            <label className="block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {label}
            </label>

            {isEditing ? (
                textarea ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                    />
                ) : options ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        style={inputStyle}
                    >
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        style={inputStyle}
                    />
                )
            ) : (
                <div className="px-4 py-3 rounded-lg" style={inputStyle}>
                    {value}
                </div>
            )}
        </div>
    );
};

export default EditableField;