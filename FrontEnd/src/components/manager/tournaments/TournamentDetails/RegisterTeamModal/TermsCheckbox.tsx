interface TermsCheckboxProps {
    agree: boolean;
    onToggle: () => void;
}
export function TermsCheckbox({ agree, onToggle }: TermsCheckboxProps) {
    return (
        <div className="flex items-center gap-3 px-1">
            <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={onToggle}
                className="w-4 h-4 accent-primary border-border rounded transition-all cursor-pointer"
            />
            <label htmlFor="agree" className="text-xs text-muted-foreground leading-tight cursor-pointer select-none">
                I agree to the <span className="text-foreground font-semibold hover:underline decoration-primary">Tournament Terms</span> and Player Code of Conduct.
            </label>
        </div>
    );
}