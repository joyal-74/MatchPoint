import { SignupRoles, type SignupRole } from "../types/UserRoles";

export const roleToEndpoint: Record<SignupRole, string> = {
    [SignupRoles.Player]: "/auth/signup/player",
    [SignupRoles.Manager]: "/auth/signup/manager",
    [SignupRoles.Viewer]: "/auth/signup/viewer",
};

export function getEndpoint(role: SignupRole) {
    return roleToEndpoint[role];
}