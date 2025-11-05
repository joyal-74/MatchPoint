import { Tournament } from "domain/entities/Tournaments";

export interface IGetPlayerTournaments {
    execute(
        status: string,
        page: number,
        limit: number,
        playerId?: string
    ): Promise<{ tournaments: Tournament[]; total: number }>
}
