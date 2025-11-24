import type { UserProfile } from "../../../types/Profile";
import EditableField from "../../ui/EditableField";

interface ProfileFormProps {
    formData: UserProfile;
    isEditing: boolean;
    onChange: (field: keyof UserProfile, value: string) => void;
}
const ProfileForm: React.FC<ProfileFormProps> = ({ formData, isEditing, onChange }) => {

    return (
        <div className="w-full flex mx-auto gap-3 px-8">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { label: "First Name", field: "firstName", placeholder: "First Name" },
                    { label: "Last Name", field: "lastName", placeholder: "Last Name" },
                    { label: "Username", field: "username", placeholder: "Enter your username" },
                    { label: "Email", field: "email", type: "email", placeholder: "Enter your email" },
                    { label: "Phone", field: "phone", type: "tel", placeholder: "Enter your phone" },
                    { label: "Gender", field: "gender", options: ["Male", "Female", "Other"], placeholder: "Select gender" },
                    { label: "Bio", field: "bio", textarea: true, fullWidth: true, placeholder: "Enter your bio" },
                ].map(({ label, field, type, options, textarea, fullWidth, placeholder }) => (
                    <EditableField
                        key={field}
                        label={label}
                        placeholder={placeholder}
                        type={type}
                        value={formData[field as keyof UserProfile] || ""}
                        options={options}
                        isEditing={isEditing}
                        textarea={textarea}
                        fullWidth={fullWidth}
                        onChange={(val) => onChange(field as keyof UserProfile, val)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileForm;