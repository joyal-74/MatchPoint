interface TermsCheckboxProps {
    agree: boolean;
    onToggle: () => void;
}

export default function TermsCheckbox({ agree, onToggle }: TermsCheckboxProps) {
    return (
        <div className="flex items-start gap-3">
            <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={onToggle}
                className="w-5 h-5 mt-0.5 accent-green-500 rounded focus:ring-green-500 focus:ring-2"
            />
            <label htmlFor="agree" className="text-sm text-neutral-400 leading-relaxed">
                I agree to the{" "}
                <span className="text-green-400 hover:underline cursor-pointer font-medium">
                    tournament rules and regulations.
                </span>
            </label>
        </div>
    );
}
