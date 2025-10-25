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
    roles = ["player", "manager", "viewer"],
}) => {
    return (
        <div className="mb-8 flex justify-center">
            <div className="flex bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 backdrop-blur-md rounded-xl p-1 shadow-inner border border-white/10">
                {roles.map((role) => {
                    const label =
                        Object.keys(UserRole).find(
                            (key) => UserRole[key as keyof typeof UserRole] === role
                        ) ?? role;

                    const isActive = selectedRole === role;

                    return (
                        <button
                            key={role}
                            type="button"
                            onClick={() => onChange(role)}
                            className={`relative px-5 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-300 
                ${isActive
                                    ? "bg-primary text-neutral-800 shadow-green-300"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            {label}
                            {isActive && (
                                <span className="absolute inset-0 rounded-lg ring-2 ring-emerald-500/60 animate-pulse"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RolePicker;