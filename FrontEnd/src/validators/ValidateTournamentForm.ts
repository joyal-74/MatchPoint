import type { TournamentFormData } from "../components/manager/tournaments/TournamentModal/types";

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export const validateTournamentForm = (data: TournamentFormData): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.title.trim()) errors.title = "Tournament name is required.";
    if (!data.sport) errors.sport = "Please select a sport.";
    if (!data.startDate) errors.startDate = "Start date is required.";
    if (!data.endDate) errors.endDate = "End date is required.";
    if (!data.regDeadline) errors.regDeadline = "Registration deadline is required.";
    if (!data.format) errors.format = "Please select a tournament format.";
    if (!data.description.trim()) errors.description = "Description is required.";
    if (!data.entryFee.trim()) errors.entryFee = "Entry Fee is required.";

    if (data.minTeams < 2) errors.minTeams = "Minimum teams must be at least 2.";
    if (data.maxTeams < data.minTeams) errors.maxTeams = "Max teams must be greater than or equal to min teams.";
    if (Number(data.entryFee) < 0) errors.entryFee = "Entry fee cannot be negative.";
    if (data.playersPerTeam < 2) errors.playersPerTeam = "There must be at least 2 players per team.";


    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const deadline = new Date(data.regDeadline);

    if (deadline >= start)
        errors.regDeadline = "Registration deadline must be before the start date.";

    if (end <= start)
        errors.endDate = "End date must be after the start date.";

    if (!data.location.trim()) errors.location = "Tournament location is required.";

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
