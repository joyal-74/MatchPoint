import { ExtraType } from "./Extra";
import { AddWicketPayload, Innings } from "./Innings";

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
        console.log(type, runs, '//////')
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

    toDTO() {
        return {
            matchId: this.matchId,
            tournamentId: this.tournamentId,
            isLive: this.isLive,
            currentInnings: this.currentInningsNumber,
            oversLimit: this.oversLimit,
            hasSuperOver: this.hasSuperOver,
            isMatchComplete: this.isMatchComplete,
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