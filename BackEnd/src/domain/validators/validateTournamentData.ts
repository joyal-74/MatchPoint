import { BadRequestError } from "../../domain/errors/index";
import { File } from "../../domain/entities/File";
import { Tournament } from "../entities/Tournaments";


export function validateTournamentData(data: Tournament, file?: File) {
    const errors: Record<string, string> = {};

    // Basic Field Checks
    if (!data.title?.trim()) errors.title = "Tournament name is required.";
    if (!data.sport) errors.sport = "Please select a sport.";
    if (!data.description?.trim()) errors.description = "Description is required.";
    if (!data.location?.trim()) errors.location = "Tournament location is required.";

    // Financials & Teams
    if (data.entryFee === undefined || Number(data.entryFee) < 0) {
        errors.entryFee = "Valid entry fee is required.";
    }

    if (data.minTeams < 2) errors.minTeams = "Minimum 2 teams required.";
    if (data.maxTeams < data.minTeams) {
        errors.maxTeams = "Max teams cannot be less than min teams.";
    }

    if (data.playersPerTeam < 7) {
        errors.playersPerTeam = "Minimum 7 players per team required.";
    }

    // Date Logic
    const start = new Date(data.startDate).getTime();
    const end = new Date(data.endDate).getTime();
    const deadline = new Date(data.regDeadline).getTime();
    const now = new Date().setHours(0, 0, 0, 0);

    if (start < now) errors.startDate = "Start date cannot be in the past.";
    if (deadline >= start) errors.regDeadline = "Deadline must be before the start date.";
    if (end <= start) errors.endDate = "End date must be after the start date.";

    // Banner File Validation
    if (file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            errors.banner = "Invalid file type. Only PNG/JPG/WebP allowed.";
        }
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.buffer.length > MAX_SIZE) {
            errors.banner = "Image is too large. Max size allowed is 2MB.";
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new BadRequestError("Tournament validation failed", errors);
    }

    return data;
}
