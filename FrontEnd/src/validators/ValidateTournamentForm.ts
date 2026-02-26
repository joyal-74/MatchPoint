import type { TournamentFormData } from "../components/manager/tournaments/TournamentModal/types";

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}


export const validateTournamentForm = (data: TournamentFormData): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) errors.title = "Tournament name is required.";
    if (!data.sport) errors.sport = "Please select a sport.";
    if (!data.format) errors.format = "Please select a tournament format.";
    if (!data.description?.trim()) errors.description = "Description is required.";
    if (!data.location?.trim()) errors.location = "Tournament location is required.";

    if (data.entryFee === undefined || data.entryFee === null || data.entryFee === "") {
        errors.entryFee = "Entry fee is required.";
    } else if (Number(data.entryFee) < 0) {
        errors.entryFee = "Entry fee cannot be negative.";
    }

    if (data.minTeams < 2) errors.minTeams = "Minimum teams must be at least 2.";
    if (data.maxTeams > 50) errors.maxTeams = "Maximum teams allowed is 50.";
    
    if (Number(data.maxTeams) < Number(data.minTeams)) {
        errors.maxTeams = "Max teams cannot be less than min teams.";
    }

    if (data.playersPerTeam < 7) {
         errors.playersPerTeam = "Minimum 7 player per team required.";
    }

    // Date Validations
    if (!data.startDate) errors.startDate = "Start date is required.";
    if (!data.endDate) errors.endDate = "End date is required.";
    if (!data.regDeadline) errors.regDeadline = "Registration deadline is required.";

    if (data.startDate && data.endDate && data.regDeadline) {
        const start = new Date(data.startDate).getTime();
        const end = new Date(data.endDate).getTime();
        const deadline = new Date(data.regDeadline).getTime();
        const now = new Date().setHours(0,0,0,0);

        if (start < now) errors.startDate = "Start date cannot be in the past.";
        if (deadline >= start) errors.regDeadline = "Deadline must be before the start date.";
        if (end <= start) errors.endDate = "End date must be after the start date.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};