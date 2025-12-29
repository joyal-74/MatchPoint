import React from "react";
import { UserRole, type SignupRole } from "../../types/UserRoles";

interface RolePickerProps {
    selectedRole: SignupRole;
    onChange: (role: SignupRole) => void;
    roles?: SignupRole[];
}

const RolePicker: React.FC<RolePickerProps> = ({ selectedRole, onChange, roles = ["player", "manager", "viewer"], }) => {
    return (
        <div className="mb-8 flex justify-center">
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50 backdrop-blur-sm relative">

                {roles.map((role) => {
                    const label = Object.keys(UserRole).find(
                        (key) => UserRole[key as keyof typeof UserRole] === role
                    ) ?? role;

                    const isActive = selectedRole === role;

                    return (
                        <button
                            key={role}
                            type="button"
                            onClick={() => onChange(role)}
                            className={`
                                relative px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300
                                ${isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                                }
                            `}
                        >
                            {label}

                            {isActive && (
                                <span className="absolute inset-0 rounded-lg ring-2 ring-primary/30 animate-pulse"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RolePicker;