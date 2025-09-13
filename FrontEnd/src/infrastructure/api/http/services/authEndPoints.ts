import { SignupRoles, type SignupRole } from "../../../../core/domain/types/UserRoles";

export const roleToEndpoint: Record<SignupRole, string> = {
    [SignupRoles.Player]: "/signup/player",
    [SignupRoles.Manager]: "/signup/manager",
    [SignupRoles.Viewer]: "/signup/viewer",
};

export function getEndpoint(role: SignupRole) {
    return roleToEndpoint[role];
}