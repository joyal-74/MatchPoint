import { ExtraType } from "./Extra";
import { MatchStatus } from "./Fixture";
import { AddWicketPayload, Innings } from "./Innings";

export type MatchEndInfo = {
    type: "NORMAL" | "ABANDONED" | "NO_RESULT" | null;
    reason: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER" | null;
    notes?: string;
    endedBy?: string | null;
    endedAt?: Date | null;
};

export interface AddRunsPayload {
    runs: number;
    strikerId?: string;
    extrasRuns?: number;
    bowlerId?: string;
    extrasType?: ExtraType | string;
    isLegalBall?: boolean;
}

export interface InitInningsPayload {
    matchId: string;
    oversLimit: number;
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    battingTeamId: string;
    bowlingTeamId: string;
}

export interface RetireBatsmanPayload {
    outBatsmanId: string;
    newBatsmanId: string;
    isRetiredHurt: boolean;
}

export class MatchEntity {
    tournamentId: string;
    matchId: string;
    oversLimit: number;
    venue: string;
    isLive: boolean;
    winner: string | null;
    status: MatchStatus;
    endInfo?: MatchEndInfo;


    currentInningsNumber = 1;

    innings1: Innings;
    innings2?: Innings | null;

    hasSuperOver = false;
    isMatchComplete = false;

    constructor(init: {
        tournamentId: string;
        matchId: string;
        oversLimit: number;
        venue: string;
        isLive: boolean;
        endInfo?: MatchEndInfo;
        status?: MatchStatus;
        winner?: string | null;
        innings1?: Innings;
        innings2?: Innings | null;
        currentInnings?: number;
        hasSuperOver?: boolean;
    }) {
        this.tournamentId = init.tournamentId;
        this.matchId = init.matchId;
        this.oversLimit = init.oversLimit;
        this.venue = init.venue ?? "";
        this.isLive = init.isLive;
        this.winner = init.winner ?? null;
        this.endInfo = init.endInfo ?? undefined;
        this.status = init.status

        this.innings1 = init.innings1 ?? new Innings({
            oversLimit: this.oversLimit,
            battingTeam: undefined,
            bowlingTeam: undefined
        });

        this.innings2 = init.innings2 ?? null;

        if (init.currentInnings !== undefined) {
            this.currentInningsNumber = init.currentInnings;
        }

        if (init.hasSuperOver !== undefined) {
            this.hasSuperOver = init.hasSuperOver;
        }
    }

    private get activeInnings(): Innings {
        if (this.currentInningsNumber === 1) {
            return this.innings1;
        }
        if (this.currentInningsNumber === 2) {
            if (!this.innings2) {
                this.innings2 = new Innings({
                    oversLimit: this.oversLimit,
                    battingTeam: undefined,
                    bowlingTeam: undefined
                });
            }
            return this.innings2;
        }
        throw new Error(`Invalid innings number: ${this.currentInningsNumber}`);
    }

    get currentStriker(): string | undefined {
        return this.activeInnings.currentStriker;
    }

    get currentNonStriker(): string | undefined {
        return this.activeInnings.currentNonStriker;
    }

    get currentBowler(): string | undefined {
        return this.activeInnings.currentBowler;
    }

    initInnings(payload: Omit<InitInningsPayload, 'matchId'>) {
        this.activeInnings.initializeInnings({
            oversLimit: payload.oversLimit,
            strikerId: payload.strikerId,
            nonStrikerId: payload.nonStrikerId,
            bowlerId: payload.bowlerId,
            battingTeamId: payload.battingTeamId,
            bowlingTeamId: payload.bowlingTeamId
        });
        this.status = 'ongoing';
    }

    addRunsToCurrentInnings(payload: AddRunsPayload) {
        const striker = payload.strikerId ?? this.currentStriker;
        const bowler = payload.bowlerId ?? this.currentBowler;

        if (!striker || !bowler) {
            throw new Error("Cannot add runs: Striker or Bowler not set for this innings.");
        }

        const inningsPayload = {
            strikerId: striker,
            bowlerId: bowler,
            runs: payload.runs,
            extrasType: payload.extrasType,
            extrasRuns: payload.extrasRuns,
            isLegalBall: payload.isLegalBall
        };

        this.activeInnings.addRuns(inningsPayload);
    }

    addWicketToCurrentInnings(payload: AddWicketPayload) {
        this.activeInnings.handleWicket(payload);
    }

    setCurrentBowler(bowlerId: string) {
        this.activeInnings.setCurrentBowler(bowlerId);
    }

    setCurrentStriker(batsmanId: string) {
        this.activeInnings.setCurrentStriker(batsmanId);
    }

    setCurrentNonStriker(batsmanId: string) {
        this.activeInnings.setCurrentNonStriker(batsmanId);
    }

    addExtras(type: string, runs: number) {
        this.activeInnings.addExtras({
            type: type as ExtraType,
            runs: runs
        });
    }

    undoLastBall() {
        this.activeInnings.undoLastBall();
    }

    startSuperOver() {
        this.hasSuperOver = true;
        // Reset overs limit for super over
        this.oversLimit = 1;

        // Reset innings for super over
        this.innings1 = new Innings({
            oversLimit: 1,
            battingTeam: undefined,
            bowlingTeam: undefined
        });
        this.innings2 = new Innings({
            oversLimit: 1,
            battingTeam: undefined,
            bowlingTeam: undefined
        });
        this.currentInningsNumber = 1;
        this.isMatchComplete = false;
    }

    endOver() {
        this.activeInnings.endOver();
    }

    endInnings() {
        this.activeInnings.completeInnings();

        if (this.currentInningsNumber === 1) {
            this.currentInningsNumber = 2;
        } else {
            this.isMatchComplete = true;
        }
    }

    addPenaltyRuns(runs: number) {
        this.activeInnings.addPenaltyRuns(runs);
    }

    retireBatsman(payload: RetireBatsmanPayload) {
        this.activeInnings.retireBatsman(payload);
    }

    // Helper method to check if innings is complete
    isInningsComplete(inningsNumber: number): boolean {
        if (inningsNumber === 1) {
            return this.innings1.isCompleted;
        } else if (inningsNumber === 2 && this.innings2) {
            return this.innings2.isCompleted;
        }
        return false;
    }

    // Helper to get innings by number
    getInnings(inningsNumber: number): Innings | null {
        if (inningsNumber === 1) return this.innings1;
        if (inningsNumber === 2) return this.innings2 || null;
        return null;
    }

    endMatch(params: {
        winnerId?: string | null;
        type: "NORMAL" | "ABANDONED" | "NO_RESULT";
        reason?: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER";
        endedBy?: string;
    }) {
        this.isMatchComplete = true;
        this.isLive = false;
        this.status = "completed";
        this.winner = params.winnerId ?? null;

        this.endInfo = {
            type: params.type,
            reason: params.reason ?? null,
            endedBy: params.endedBy ?? null,
            endedAt: new Date()
        };
    }


    toDTO() {
        return {
            matchId: this.matchId,
            tournamentId: this.tournamentId,
            isLive: this.isLive,
            status : this.status,
            currentInnings: this.currentInningsNumber,
            oversLimit: this.oversLimit,
            hasSuperOver: this.hasSuperOver,
            isMatchComplete: this.isMatchComplete,
            endInfo: this.endInfo ?? null,
            innings1: this.innings1.toDTO(),
            innings2: this.innings2 ? this.innings2.toDTO() : null,
            currentContext: {
                striker: this.currentStriker,
                nonStriker: this.currentNonStriker,
                bowler: this.currentBowler
            },
        };
    }
}