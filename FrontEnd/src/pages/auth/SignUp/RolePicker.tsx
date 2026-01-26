interface RolePickerProps {
    selectedRole: string;
    onRoleChange: (role: string) => void;
    roles: string[];
}

const RolePicker = ({ selectedRole, onRoleChange, roles }: RolePickerProps) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">
            Account Role
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {roles.map((role) => {
                const isActive = selectedRole === role;
                return (
                    <button
                        key={role}
                        type="button"
                        onClick={() => onRoleChange(role)}
                        className={`py-2.5 rounded-xl border-2 text-[10px] font-bold uppercase transition-all active:scale-95
              ${isActive
                                ? 'bg-primary/5 border-primary text-primary shadow-sm'
                                : 'bg-background border-transparent text-muted-foreground hover:border-border'}`}
                    >
                        {role}
                    </button>
                );
            })}
        </div>
    </div>
);

export default RolePicker;