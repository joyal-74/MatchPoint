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

    currentInningsNumber = 1;

    innings1: Innings;
    innings2?: Innings | null;

    hasSuperOver = false;
    isMatchComplete = false;

    constructor(init: {
        tournamentId: string;
        matchId: string;
        oversLimit: number;
        innings1?: Innings;
        innings2?: Innings | null;
        currentInnings?: number;
        hasSuperOver?: boolean;
    }) {
        this.tournamentId = init.tournamentId;
        this.matchId = init.matchId;
        this.oversLimit = init.oversLimit;

        this.innings1 = init.innings1 ?? new Innings();
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
                this.innings2 = new Innings();
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

        this.activeInnings.addRuns({
            ...payload,
            strikerId: striker,
            bowlerId: bowler
        });
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
        this.activeInnings.addExtras({ runs, type });
    }

    undoLastBall() {
        this.activeInnings.undoLastBall();
    }

    startSuperOver() {
        this.hasSuperOver = true;
    }

    endOver() {
        this.activeInnings.endOver();
    }

    endInnings() {
        if (typeof this.activeInnings.completeInnings === 'function') {
            this.activeInnings.completeInnings();
        }

        if (this.currentInningsNumber === 1) {
            this.currentInningsNumber = 2;
        } else {
            this.isMatchComplete = true;
        }
    }

    addPenaltyRuns(runs: number) {
        if (typeof this.activeInnings.addPenaltyRuns === 'function') {
            this.activeInnings.addPenaltyRuns(runs);
        } else {
            this.addRunsToCurrentInnings({
                runs: 0,
                extrasRuns: runs,
                extrasType: 'PENALTY'
            });
        }
    }

    retireBatsman(payload: RetireBatsmanPayload) {
        this.activeInnings.retireBatsman(payload);
    }


    toDTO() {
        return {
            matchId: this.matchId,
            tournamentId: this.tournamentId,
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
            }
        };
    }
}