import React from "react";
import { CgGirl } from "react-icons/cg";
import { TbMoodBoy } from "react-icons/tb";

export type Gender = "male" | "female";

interface GenderPickerProps {
    selectedGender: Gender;
    onChange: (gender: Gender) => void;
    genders?: Gender[];
}

const GenderPicker: React.FC<GenderPickerProps> = ({
    selectedGender = 'male',
    onChange,
    genders = ["male", "female"]
}) => {
    return (
        <div className="mb-2 flex justify-center">
            <div className="bg-[var(--color-surface-raised)] rounded-lg p-0.5 inline-flex">
                {genders.map((gender) => (
                    <button
                        key={gender}
                        type="button"
                        onClick={() => onChange(gender)}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selectedGender === gender
                            ? "bg-[var(--color-primary-active)] text-[var(--color-text-primary)] shadow-lg"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                            }`}
                    >
                        {gender === "male" && (
                            <TbMoodBoy className="w-5 h-5" />
                        )}
                        {gender === "female" && (
                            <CgGirl className="w-5 h-5" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenderPicker;