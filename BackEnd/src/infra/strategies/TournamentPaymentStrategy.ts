import { TournamentPaymentMetadata } from "../../app/repositories/interfaces/IBasePaymentMetaData.js";
import { IPaymentStrategy } from "../../app/repositories/interfaces/shared/IPaymentStrategy.js";

export class TournamentPaymentStrategy implements IPaymentStrategy {
    type = 'tournament' as const;

    getReceipt(metadata: TournamentPaymentMetadata): string {
        const tmtId = metadata.tournamentId.slice(-4);
        const teamId = metadata.teamId.slice(-4);
        return `tmt_${tmtId}_${teamId}_${Date.now()}`;
    }

    getNotes(metadata: TournamentPaymentMetadata): Record<string, string> {
        return {
            type: this.type,
            tournamentId: metadata.tournamentId,
            teamId: metadata.teamId,
            captainId: metadata.captainId,
            managerId: metadata.managerId
        };
    }

    parseNotes(notes: Record<string, string>): TournamentPaymentMetadata {
        return {
            type: 'tournament',
            tournamentId: notes.tournamentId,
            teamId: notes.teamId,
            captainId: notes.captainId,
            managerId: notes.managerId
        };
    }
}