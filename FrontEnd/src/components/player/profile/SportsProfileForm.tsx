import type { playerProfileData } from "../../../types/Player";
import { sportProfileConfig } from "../../../utils/sportsConfig";
import EditableField from "../../ui/EditableField";

interface ProfileFormProps {
    formData: playerProfileData;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
}

const SportsProfileForm: React.FC<ProfileFormProps> = ({ formData, isEditing, onChange }) => {
    const selectedSport = formData.sport.toLowerCase();
    const sportSpecificFields = sportProfileConfig[selectedSport] || [];

    return (
        <div className="w-full flex mx-auto gap-3">
            <div className="w-full grid grid-cols-1 gap-3">
                {sportSpecificFields.map(({ key, label, type, options }) => (
                    <EditableField
                        key={key}
                        label={label}
                        placeholder={`Enter ${label}`}
                        value={formData.profile[key] || ""}
                        type={type === "number" ? "number" : "text"}
                        options={options}
                        isEditing={isEditing}
                        onChange={(val) => onChange(key, val)}
                    />
                ))}
            </div>
        </div>
    );
};


export default SportsProfileForm;