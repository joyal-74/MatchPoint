import React from "react";
import EditableField from "../ui/EditableField";
import type { UserProfile } from "../../types/Profile";

interface ProfileFormProps {
    formData: UserProfile;
    isEditing: boolean;
    onChange: (field: keyof UserProfile, value: string) => void;
    errors: Record<string, string>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ formData, isEditing, onChange, errors }) => {

    const fields = [
        { label: "First Name", field: "firstName", placeholder: "John", width: "half" },
        { label: "Last Name", field: "lastName", placeholder: "Doe", width: "half" },
        { label: "Username", field: "username", placeholder: "johndoe", width: "full" },
        { label: "Email Address", field: "email", type: "email", placeholder: "john@example.com", width: "full" },
        { label: "Phone Number", field: "phone", type: "tel", placeholder: "+91 98765 43210", width: "half" },
        { label: "Gender", field: "gender", options: ["Male", "Female", "Other"], placeholder: "Select", width: "half" },
        { label: "Bio", field: "bio", textarea: true, placeholder: "Tell us a bit about yourself...", width: "full" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            {fields.map(({ label, field, type, options, textarea, width, placeholder }) => (
                <div key={field} className={width === "full" ? "md:col-span-2" : "md:col-span-1"}>
                    <EditableField
                        label={label}
                        placeholder={placeholder}
                        type={type}
                        value={formData[field as keyof UserProfile] || ""}
                        options={options}
                        isEditing={isEditing}
                        textarea={textarea}
                        fullWidth={true}
                        onChange={(val) => onChange(field as keyof UserProfile, val)}
                        error={errors[field]}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProfileForm;