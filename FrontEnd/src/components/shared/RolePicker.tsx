import React from "react";
import { UserRole, type SignupRole } from "../../types/UserRoles";

interface RolePickerProps {
    selectedRole: SignupRole;
    onChange: (role: SignupRole) => void;
    roles?: SignupRole[];
}

const RolePicker: React.FC<RolePickerProps> = ({
    selectedRole,
    onChange,
    roles = [ "player","manager", "viewer"]
}) => {
    return (
        <div className="mb-6 flex justify-center">
            <div className="bg-[var(--color-surface-raised)] rounded-lg p-0.5 inline-flex">
                {roles.map((role) => {

                    const label =
                        Object.keys(UserRole).find(
                            (key) => UserRole[key as keyof typeof UserRole] === role
                        ) ?? role;

                    return (
                        <button
                            key={role}
                            type="button"
                            onClick={() => onChange(role)}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${selectedRole === role
                                    ? "bg-[var(--color-primary-active)] text-[var(--color-text-primary)] shadow-lg"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RolePicker;