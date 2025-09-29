import EditableField from "../ui/EditableField";
import type { UserProfile } from "../../types/Profile";

interface ProfileFormProps {
    formData: UserProfile;
    isEditing: boolean;
    onChange: (field: keyof UserProfile, value: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ formData, isEditing, onChange }) => (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 gap-x-5 mb-7">
        {[
            { label: "First Name", field: "firstName" },
            { label: "Last Name", field: "lastName" },
            { label: "Username", field: "username" },
            { label: "Email", field: "email", type: "email" },
            { label: "Phone", field: "phone", type: "tel" },
            { label: "Gender", field: "gender", options: ["Male", "Female", "Other"] },
            { label: "Bio", field: "bio", textarea: true, fullWidth: true },
        ].map(({ label, field, type, options, textarea, fullWidth }) => (
            <EditableField
                key={field}
                label={label}
                type={type}
                value={formData[field as keyof UserProfile]}
                options={options}
                isEditing={isEditing}
                textarea={textarea}
                fullWidth={fullWidth}
                onChange={(val) => onChange(field as keyof UserProfile, val)}
            />
        ))}
    </div>
);

export default ProfileForm;