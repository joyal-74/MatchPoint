import type { TournamentFormData, updateTournamentFormData } from "../../components/manager/tournaments/TournamentModal/types";
import type { Tournament, TournamentRegister, TournamentUpdate } from "../../features/manager/managerTypes";

export class TournamentMapper {
    // Frontend form data to backend-ready Tournament DTO
    static fromFormData(formData: TournamentFormData, managerId: string): TournamentRegister {
        const totalEntryCollected = Number(formData.entryFee) * Number(formData.minTeams);
        const prizePool = Math.floor(totalEntryCollected * 0.7);

        return {
            ...formData,
            currTeams: 0,
            managerId,
            prizePool,
            rules: formData.rules.map((r) => r.trim()).filter(Boolean),
        };
    }

    static fromEditingData(formData: updateTournamentFormData, managerId: string): TournamentUpdate {
        const teamCount = Math.max(Number(formData.currTeams), Number(formData.minTeams));
        const totalEntryCollected = Number(formData.entryFee) * teamCount;
        const prizePool = Math.floor(totalEntryCollected * 0.7);

        return {
            ...formData,
            managerId,
            prizePool,
            rules: formData.rules.map((r) => r.trim()).filter(Boolean),
        };
    }

    // backend Tournament entity to form data for editing
    static toFormData(tournament: Tournament): Omit<TournamentFormData, "currTeams"> {
        return {
            title: tournament.title,
            managerId: tournament.managerId,
            description: tournament.description,
            sport: tournament.sport,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
            regDeadline: tournament.regDeadline,
            location: tournament.location,
            maxTeams: tournament.maxTeams,
            minTeams: tournament.minTeams,
            entryFee: String(tournament.entryFee),
            playersPerTeam : tournament.playersPerTeam,
            format: tournament.format,
            prizePool: tournament.prizePool,
            rules: tournament.rules,
            banner : tournament.banner,
            umpireId : tournament.umpire
        };
    }

    static toTournamentResponse(data: Tournament): Tournament {
        return {
            ...data,
            startDate: data.startDate,
            endDate: data.endDate,
            regDeadline: data.regDeadline,
            rules: data.rules || [],
        };
    }

    static toTournamentResponseArray(tournament: Tournament[]): Tournament[] {
        return tournament.map(this.toTournamentResponse);
    }
}