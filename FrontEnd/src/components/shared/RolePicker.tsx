import React from "react";
import { User, Shield, Eye, Scale } from "lucide-react";
import { type SignupRole } from "../../types/UserRoles";

interface RolePickerProps {
    selectedRole: SignupRole;
    onChange: (role: SignupRole) => void;
    roles?: SignupRole[];
}

const roleIcons: Record<string, React.ReactNode> = {
    player: <User size={18} />,
    manager: <Shield size={18} />,
    viewer: <Eye size={18} />,
    umpire: <Scale size={18} />
};

const RolePicker: React.FC<RolePickerProps> = ({ selectedRole, onChange, roles = ["player", "manager", "viewer", "umpire"] }) => {
    return (
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {roles.map((role) => {
                const isActive = selectedRole === role;
                return (
                    <button
                        key={role}
                        type="button"
                        onClick={() => onChange(role)}
                        className={`
                            relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2
                            ${isActive 
                                ? "border-primary bg-primary/5 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                                : "border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/50"}
                        `}
                    >
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                            {roleIcons[role]}
                        </div>
                        <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.1em]">
                            {role}
                        </span>
                        {isActive && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default RolePicker;