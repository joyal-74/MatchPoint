export const UserRoles = {
    Player: "player",
    Viewer: "viewer",
    Manager: "manager",
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];
export const RoleValues = Object.values(UserRoles);

export const AllRoles = {
    ...UserRoles,
    Admin: "admin",
} as const;

export type AllRole = typeof AllRoles[keyof typeof AllRoles];
export const AllRoleValues = Object.values(AllRoles);