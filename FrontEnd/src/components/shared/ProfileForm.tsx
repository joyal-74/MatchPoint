import EditableField from "../ui/EditableField";
import type { UserProfile } from "../../types/Profile";

interface ProfileFormProps {
    formData: UserProfile;
    isEditing: boolean;
    onChange: (field: keyof UserProfile, value: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ formData, isEditing, onChange }) => (
    <>
        <div className="w-full flex mx-auto gap-3 px-8">
            <div className="w-5/7 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { label: "First Name", field: "firstName", placeholder: "FirstName" },
                    { label: "Last Name", field: "lastName", placeholder: "FirstName" },
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
            <div className="w-2/7 grid grid-cols-1 gap-3">
                {[
                    { label: "Batting Style", field: "battingStyle", options: ["Right Hand", "Left Hand"], placeholder: "Select Batting Style" },
                    { label: "Bowling Style", field: "bowlingStyle", options: ["Spin", "Fast", "Medium"], placeholder: "Select Bowling Style" },
                    { label: "Preferred Position", field: "position", options: ["Batter", "Bowler", "All rounder", "Wicket Keeper"], placeholder: "Select position" },
                    { label: "Jersey Number", field: "jerseyNumber", options: ["Male", "Female", "Other"], placeholder: "Select a jersey Number" },
                ].map(({ label, field, options, placeholder }) => (
                    <EditableField
                        key={field}
                        label={label}
                        placeholder={placeholder}
                        value={formData[field as keyof UserProfile] || ""}
                        options={options}
                        isEditing={isEditing}
                        onChange={(val) => onChange(field as keyof UserProfile, val)}
                    />
                ))}
            </div>
        </div>
    </>
);

export default ProfileForm;