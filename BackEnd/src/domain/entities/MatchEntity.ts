import { ExtraType } from "./Extra";
import { MatchStatus } from "./Fixture";
import { AddWicketPayload, Innings } from "./Innings";

export type MatchEndInfo = {
    type: "NORMAL" | "ABANDONED" | "NO_RESULT" | null;
    reason: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER" | "COMPLETED" | null;
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
    status: MatchStatus;
    
    // --- Result Fields ---
    winner: string | null;
    resultType?: 'WIN' | 'TIE' | 'DRAW' | null;
    winMargin?: string | null;
    winType?: 'runs' | 'wickets' | null;
    resultDescription?: string;
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
        
        status?: MatchStatus;
        winner?: string | null;
        resultType?: 'WIN' | 'TIE' | 'DRAW' | null;
        winMargin?: string | null;
        winType?: 'runs' | 'wickets' | null;
        resultDescription?: string;
        endInfo?: MatchEndInfo;

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
        this.status = init.status ?? "upcoming"; // Default to upcoming if undefined
        
        // Result initialization
        this.winner = init.winner ?? null;
        this.resultType = init.resultType;
        this.winMargin = init.winMargin;
        this.winType = init.winType;
        this.resultDescription = init.resultDescription;
        this.endInfo = init.endInfo ?? undefined;

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
        
        // Infer completion status if loaded from DB as completed
        if (this.status === 'completed') {
            this.isMatchComplete = true;
        }
    }

    // ... (Keep existing getter methods: activeInnings, currentStriker, etc.) ...
    
    private get activeInnings(): Innings {
        if (this.currentInningsNumber === 1) return this.innings1;
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

    get currentStriker(): string | undefined { return this.activeInnings.currentStriker; }
    get currentNonStriker(): string | undefined { return this.activeInnings.currentNonStriker; }
    get currentBowler(): string | undefined { return this.activeInnings.currentBowler; }

    // ... (Keep existing game logic methods: initInnings, addRunsToCurrentInnings, etc.) ...
    
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
        if (!striker || !bowler) throw new Error("Cannot add runs: Striker or Bowler not set.");
        this.activeInnings.addRuns({ ...payload, strikerId: striker, bowlerId: bowler });
    }

    addWicketToCurrentInnings(payload: AddWicketPayload) { this.activeInnings.handleWicket(payload); }
    setCurrentBowler(bowlerId: string) { this.activeInnings.setCurrentBowler(bowlerId); }
    setCurrentStriker(batsmanId: string) { this.activeInnings.setCurrentStriker(batsmanId); }
    setCurrentNonStriker(batsmanId: string) { this.activeInnings.setCurrentNonStriker(batsmanId); }
    addExtras(type: string, runs: number) { this.activeInnings.addExtras({ type: type as ExtraType, runs }); }
    undoLastBall() { this.activeInnings.undoLastBall(); }
    
    startSuperOver() {
        this.hasSuperOver = true;
        this.oversLimit = 1;
        this.innings1 = new Innings({ oversLimit: 1, battingTeam: undefined, bowlingTeam: undefined });
        this.innings2 = new Innings({ oversLimit: 1, battingTeam: undefined, bowlingTeam: undefined });
        this.currentInningsNumber = 1;
        this.isMatchComplete = false;
    }

    endOver() { this.activeInnings.endOver(); }

    endInnings() {
        this.activeInnings.completeInnings();
        if (this.currentInningsNumber === 1) {
            this.currentInningsNumber = 2;
        } else {
            this.isMatchComplete = true;
        }
    }

    addPenaltyRuns(runs: number) { this.activeInnings.addPenaltyRuns(runs); }
    retireBatsman(payload: RetireBatsmanPayload) { this.activeInnings.retireBatsman(payload); }

    // ... (Keep helper methods isInningsComplete, getInnings) ...

    // --- UPDATED END MATCH METHOD ---
    endMatch(params: {
        winnerId?: string | null;
        type: "NORMAL" | "ABANDONED" | "NO_RESULT";
        reason?: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER" | "COMPLETED";
        endedBy?: string;
        
        // New Params
        resultType?: 'WIN' | 'TIE' | 'DRAW' | null;
        winMargin?: string | null;
        winType?: 'runs' | 'wickets' | null;
        resultDescription?: string;
    }) {
        this.isMatchComplete = true;
        this.isLive = false;
        this.status = "completed";
        
        this.winner = params.winnerId ?? null;
        this.resultType = params.resultType;
        this.winMargin = params.winMargin;
        this.winType = params.winType;
        this.resultDescription = params.resultDescription;

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
            status: this.status,
            currentInnings: this.currentInningsNumber,
            oversLimit: this.oversLimit,
            hasSuperOver: this.hasSuperOver,
            isMatchComplete: this.isMatchComplete,
            
            // Send Result Data to Client
            winner: this.winner,
            resultType: this.resultType,
            resultDescription: this.resultDescription,
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