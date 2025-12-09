import { Batsman } from "./Batsman";
import { Bowler } from "./Bowler";
import { Extras, ExtraType } from "./Extra";
import { BallLog } from "./BallLog";


export interface RetireBatsmanPayload {
    outBatsmanId: string;
    newBatsmanId: string;
    isRetiredHurt: boolean;
}

export interface AddRunsPayload {
    strikerId: string;
    bowlerId: string;
    runs: number;
    extrasType?: ExtraType | string;
    extrasRuns?: number;
    isLegalBall?: boolean;
    dismissal?: { type: string; outBatsmanId?: string; fielderId?: string };
}

export interface AddExtrasPayload {
    type: ExtraType | string;
    runs: number;
    battingTeamId?: string;
    bowlingTeamId?: string;
}

export type BowlerCreditedDismissal =
    | "bowled"
    | "caught"
    | "lbw"
    | "stumped"
    | "hit-wicket";

export type NonBowlerDismissal =
    | "run-out"
    | "retired-hurt"
    | "timed-out"
    | "obstructing-field"
    | "hit-ball-twice";

export type DismissalType =
    | BowlerCreditedDismissal
    | NonBowlerDismissal;

export interface AddWicketPayload {
    matchId: string;
    outBatsmanId: string;
    nextBatsmanId: string;
    bowlerId: string | null;
    dismissalType: DismissalType;
    fielderId?: string | null;
    isLegalBall: boolean;
    runsCompleted?: number;
}

// ----------------------
// Class Definition
// ----------------------

export class Innings {
    batsmen: Map<string, Batsman> = new Map();
    bowlers: Map<string, Bowler> = new Map();
    extras = new Extras();

    logs: BallLog[] = [];

    runs = 0;
    wickets = 0;
    balls = 0;

    // Pointers
    currentStriker?: string;
    currentNonStriker?: string;
    currentBowler?: string;
    battingTeam?: string;
    bowlingTeam?: string;
    oversLimit = 20;

    // Status
    isCompleted = false;

    constructor(init?: Partial<Innings>) {
        Object.assign(this, init || {});
    }

    get oversFormatted() {
        return `${Math.floor(this.balls / 6)}.${this.balls % 6}`;
    }

    initializeInnings(data: {
        oversLimit: number;
        strikerId: string;
        nonStrikerId: string;
        bowlerId: string;
        battingTeamId?: string;
        bowlingTeamId?: string;
    }) {
        this.oversLimit = data.oversLimit;
        this.battingTeam = data.battingTeamId;
        this.bowlingTeam = data.bowlingTeamId;

        this.currentStriker = data.strikerId;
        this.currentNonStriker = data.nonStrikerId;
        this.currentBowler = data.bowlerId;
        this.isCompleted = false;

        this.ensureBatsmanStarted(data.strikerId);
        this.ensureBatsmanStarted(data.nonStrikerId);
        this.ensureBowlerStarted(data.bowlerId);
    }

    private ensureBatsmanStarted(playerId: string) {
        if (!this.batsmen.has(playerId)) {
            this.batsmen.set(playerId, new Batsman(playerId));
        }
    }

    private ensureBowlerStarted(playerId: string) {
        if (!this.bowlers.has(playerId)) {
            this.bowlers.set(playerId, new Bowler(playerId));
        }
    }

    private normalizeDismissalType(raw: string): string {
        if (!raw) return raw;
        return raw.trim().toLowerCase().replace(/\s+/g, '-');
    }

    addRuns(payload: AddRunsPayload) {
        if (this.isCompleted) throw new Error("Innings is already completed.");

        const { strikerId, bowlerId, runs, extrasType, extrasRuns = 0 } = payload;

        this.ensureBatsmanStarted(strikerId);
        this.ensureBowlerStarted(bowlerId);

        const striker = this.batsmen.get(strikerId)!;
        const bowler = this.bowlers.get(bowlerId)!;

        // Logic: Valid ball if not Wide or No-Ball
        const isWideOrNoBall = extrasType === "wide" || extrasType === "no-ball";
        const isLegalBall = !isWideOrNoBall;

        // Update Total Score
        const totalRunsOnBall = runs + extrasRuns;
        this.runs += totalRunsOnBall;

        // Update Ball Count
        if (isLegalBall) {
            this.balls += 1;
        }

        // Update Extras Entity
        if (extrasType) {
            this.extras.add(extrasType as ExtraType, extrasRuns);
        }

        // Update Batsman Stats (Wides don't count as balls faced)
        if (extrasType !== "wide") {
            striker.addRuns(runs);
            if (isLegalBall) striker.addBallFaced();
        }

        // Update Bowler Stats
        bowler.addRunsConceded(totalRunsOnBall);
        if (isLegalBall) {
            bowler.addLegalBall();
        }

        // Handle Dismissal
        if (payload.dismissal) {
            this.handleDismissalLogic(payload.dismissal, bowler);
        }

        // Log Event
        const log: BallLog = {
            ...payload,
            extrasType: payload.extrasType as ExtraType,
            isLegalBall: isLegalBall,
            extrasRuns: extrasRuns,
            over: Math.floor(this.balls / 6),
            ballInOver: this.balls % 6 === 0 ? 6 : this.balls % 6,
            nonStrikerId: this.currentNonStriker,
            timestamp: Date.now()
        };
        this.logs.push(log);

        this.handleStrikeRotation(runs, isLegalBall);
    }


    addExtras(payload: AddExtrasPayload) {
        if (this.isCompleted) return;

        this.runs += payload.runs;

        this.extras.add(payload.type as ExtraType, payload.runs);

        const log: BallLog = {
            strikerId: this.currentStriker,
            bowlerId: this.currentBowler,
            runs: 0,
            extrasRuns: payload.runs,
            extrasType: payload.type as ExtraType,
            isLegalBall: false,
            over: Math.floor(this.balls / 6),
            ballInOver: this.balls % 6,
            nonStrikerId: this.currentNonStriker,
            timestamp: Date.now()
        };
        this.logs.push(log);
    }

    addPenaltyRuns(runs: number) {
        this.addExtras({
            type: 'penalty',
            runs: runs
        });
    }

    handleWicket(payload: AddWicketPayload) {
        const {
            outBatsmanId,
            nextBatsmanId,
            bowlerId,
            dismissalType,
            fielderId,
            isLegalBall,
            runsCompleted = 0
        } = payload;

        if (this.isCompleted) throw new Error("Innings is already completed.");


        // Normalize dismissalType
        const norm = this.normalizeDismissalType(dismissalType);

        if (outBatsmanId) this.ensureBatsmanStarted(outBatsmanId);
        if (bowlerId) this.ensureBowlerStarted(bowlerId);

        const striker = outBatsmanId ? this.batsmen.get(outBatsmanId)! : undefined;
        const bowler = bowlerId ? this.bowlers.get(bowlerId)! : undefined;

        // Runs
        if (runsCompleted > 0) {
            this.runs += runsCompleted;
            striker?.addRuns(runsCompleted);
            if (bowler && isLegalBall) bowler.addRunsConceded(runsCompleted);
        }

        // Ball count
        if (isLegalBall) {
            this.balls += 1;
            bowler?.addLegalBall();
        }

        // Wicket credit
        const bowlerCredited = ["bowled", "caught", "lbw", "stumped", "hit-wicket"];
        const bowlerGetsWicket = bowler && bowlerCredited.includes(norm);

        this.wickets += 1;
        if (bowlerGetsWicket) bowler.addWicket();

        // Mark batsman out
        const outBatsman = outBatsmanId ? this.batsmen.get(outBatsmanId) : null;
        if (outBatsman) {
            outBatsman.setOut(norm, fielderId ?? undefined);
        }

        if (nextBatsmanId) {
            this.ensureBatsmanStarted(nextBatsmanId);

            if (outBatsmanId === this.currentStriker) {
                this.currentStriker = nextBatsmanId;
            } else if (outBatsmanId === this.currentNonStriker) {
                this.currentNonStriker = nextBatsmanId;
            }
        }

        // Log ball
        this.logs.push({
            strikerId: outBatsmanId ?? this.currentStriker,
            bowlerId: bowlerId ?? this.currentBowler,
            runs: runsCompleted,
            extrasRuns: 0,
            extrasType: undefined,
            isLegalBall,
            dismissal: {
                type: norm,
                outBatsmanId: outBatsmanId,
                fielderId: fielderId ?? undefined
            },
            over: Math.floor(this.balls / 6),
            ballInOver: (this.balls % 6 === 0) ? 6 : (this.balls % 6),
            nonStrikerId: this.currentNonStriker,
            timestamp: Date.now()
        });

        // Change strike
        if (runsCompleted % 2 !== 0) this.swapStrikers();
        if (isLegalBall && this.balls % 6 === 0) this.swapStrikers();
    }

    retireBatsman(payload: RetireBatsmanPayload) {
        if (this.isCompleted) return;

        const { outBatsmanId, newBatsmanId, isRetiredHurt } = payload;

        const batsman = this.batsmen.get(outBatsmanId);
        if (!batsman) throw new Error("Batsman to retire not found");

        const dismissalType = isRetiredHurt ? "retired-hurt" : "retired-out";
        batsman.setOut(dismissalType);

        if (!isRetiredHurt) {
            this.wickets += 1;
        }

        if (this.currentStriker === outBatsmanId) {
            this.currentStriker = newBatsmanId;
        } else if (this.currentNonStriker === outBatsmanId) {
            this.currentNonStriker = newBatsmanId;
        } else {
            throw new Error("Batsman to retire is not currently on crease");
        }

        this.ensureBatsmanStarted(newBatsmanId);

        const log: BallLog = {
            strikerId: outBatsmanId,
            bowlerId: this.currentBowler,
            runs: 0,
            extrasRuns: 0,
            isLegalBall: false,
            dismissal: { type: dismissalType, outBatsmanId: outBatsmanId },
            over: Math.floor(this.balls / 6),
            ballInOver: this.balls % 6,
            timestamp: Date.now()
        };
        this.logs.push(log);
    }

    // 4. HELPERS

    private handleDismissalLogic(dismissal: { type: string; outBatsmanId?: string; fielderId?: string }, bowler: Bowler) {
        this.wickets += 1;

        if (dismissal.type !== "run-out" && dismissal.type !== "retired-out") {
            bowler.addWicket();
        }

        const outId = dismissal.outBatsmanId ?? this.currentStriker;
        if (outId) {
            const outBatsman = this.batsmen.get(outId);
            if (outBatsman) outBatsman.setOut(dismissal.type, dismissal.fielderId);
        }
    }

    private handleStrikeRotation(runs: number, isLegalBall: boolean) {
        if (runs % 2 !== 0) {
            this.swapStrikers();
        }
        if (isLegalBall && this.balls > 0 && this.balls % 6 === 0) {
            this.swapStrikers();
        }
    }

    private swapStrikers() {
        const tmp = this.currentStriker;
        this.currentStriker = this.currentNonStriker;
        this.currentNonStriker = tmp;
    }

    setCurrentBowler(bowlerId: string) {
        this.currentBowler = bowlerId;
        this.ensureBowlerStarted(bowlerId);
    }

    setCurrentStriker(batsmanId: string) {
        this.currentStriker = batsmanId;
        this.ensureBatsmanStarted(batsmanId);
    }

    setCurrentNonStriker(batsmanId: string) {
        this.currentNonStriker = batsmanId;
        this.ensureBatsmanStarted(batsmanId);
    }

    endOver() {
        if (this.isCompleted) return;
        this.currentBowler = undefined;
    }

    completeInnings() {
        this.isCompleted = true;
    }

    undoLastBall() {
        if (this.logs.length === 0) return;
        if (this.isCompleted) this.isCompleted = false;

        this.logs.pop();

        this.runs = 0;
        this.wickets = 0;
        this.balls = 0;
        this.extras = new Extras();

        this.batsmen.forEach(b => b.resetStats());
        this.bowlers.forEach(b => b.resetStats());

        const logsToReplay = [...this.logs];
        this.logs = [];

        logsToReplay.forEach(log => {
            if (log.extrasType === 'penalty') {
                this.addPenaltyRuns(log.extrasRuns || 0);
                return;
            }

            if (log.dismissal) {
                const dtype = this.normalizeDismissalType(log.dismissal.type || "");
                if (dtype.includes('retired')) {
                    const outId = log.dismissal.outBatsmanId!;
                    const newId = (log as BallLog).nextBatsmanId || undefined;
                    if (outId) {
                        this.ensureBatsmanStarted(outId);
                        const b = this.batsmen.get(outId)!;
                        b.setOut(dtype);
                        if (newId) {
                            this.ensureBatsmanStarted(newId);
                            if (this.currentStriker === outId) this.currentStriker = newId;
                            else if (this.currentNonStriker === outId) this.currentNonStriker = newId;
                        }
                    }
                    return;
                }

                if (log.isLegalBall) {
                    this.addRuns({
                        strikerId: log.strikerId!,
                        bowlerId: log.bowlerId!,
                        runs: log.runs || 0,
                        extrasType: log.extrasType,
                        extrasRuns: log.extrasRuns,
                        dismissal: log.dismissal,
                        isLegalBall: log.isLegalBall
                    });
                } else {
                    this.addRuns({
                        strikerId: log.strikerId!,
                        bowlerId: log.bowlerId!,
                        runs: log.runs || 0,
                        extrasType: log.extrasType,
                        extrasRuns: log.extrasRuns,
                        dismissal: log.dismissal,
                        isLegalBall: log.isLegalBall
                    });
                }
                return;
            }

            this.addRuns({
                strikerId: log.strikerId!,
                bowlerId: log.bowlerId!,
                runs: log.runs || 0,
                extrasType: log.extrasType,
                extrasRuns: log.extrasRuns,
                dismissal: log.dismissal,
                isLegalBall: log.isLegalBall
            });
        });

    }

    toDTO() {
        return {
            runs: this.runs,
            wickets: this.wickets,
            overs: this.oversFormatted,
            balls: this.balls,
            isCompleted: this.isCompleted,
            currentStriker: this.currentStriker,
            currentNonStriker: this.currentNonStriker,
            currentBowler: this.currentBowler,
            battingStats: Array.from(this.batsmen.values()).map(b => b.toDTO()),
            bowlingStats: Array.from(this.bowlers.values()).map(b => b.toDTO()),
            extras: this.extras
        };
    }
}