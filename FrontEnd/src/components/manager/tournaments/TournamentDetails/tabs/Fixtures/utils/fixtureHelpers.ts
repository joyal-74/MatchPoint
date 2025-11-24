import type { RegisteredTeam } from "../../TabContent";

export function getTeamName(teamId: string, teams: RegisteredTeam[]): string {
    if (!teamId) return "Bye";
    const team = teams.find(t => t._id === teamId);
    return team ? team.name : "Unknown";
}
