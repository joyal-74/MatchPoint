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
    | "retired-out"
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

export class Innings {
    batsmen: Map<string, Batsman> = new Map();
    bowlers: Map<string, Bowler> = new Map();
    extras = new Extras();

    logs: BallLog[] = [];

    runs = 0;
    wickets = 0;
    deliveries = 0;
    legalBalls = 0;
    // Pointers
    currentStriker?: string;
    currentNonStriker?: string;
    currentBowler?: string;
    battingTeam?: string;
    bowlingTeam?: string;
    oversLimit?: number;

    initialStriker?: string;
    initialNonStriker?: string;
    initialBowler?: string;

    // Status
    isCompleted = false;

    constructor(init?: Partial<Innings>) {
        Object.assign(this, init || {});
    }

    get oversFormatted() {
        return `${Math.floor(this.legalBalls / 6)}.${this.legalBalls % 6}`;
    }

    get totalDeliveries() {
        return this.deliveries;
    }

    get deliveryInOver() {
        return (this.legalBalls % 6) || 6;
    }

    get overNumber() {
        return Math.floor(this.legalBalls / 6);
    }

    initializeInnings(data: {
        oversLimit: number;
        strikerId: string;
        nonStrikerId: string;
        bowlerId: string;
        battingTeamId?: string;
        bowlingTeamId?: string;
        initialStriker?: string;
        initialNonStriker?: string;
        initialBowler?: string;
    }) {
        this.oversLimit = data.oversLimit;
        this.battingTeam = data.battingTeamId;
        this.bowlingTeam = data.bowlingTeamId;

        this.currentStriker = data.strikerId;
        this.currentNonStriker = data.nonStrikerId;
        this.currentBowler = data.bowlerId;
        this.isCompleted = false;

        this.initialStriker = data.strikerId;
        this.initialNonStriker = data.nonStrikerId;
        this.initialBowler = data.bowlerId;

        this.deliveries = 0;
        this.legalBalls = 0;

        this.ensureBatsmanStarted(data.strikerId);
        this.ensureBatsmanStarted(data.nonStrikerId);
        this.ensureBowlerStarted(data.bowlerId);
    }

    private ensureBatsmanStarted(playerId: string) {
        if (!playerId || playerId === 'undefined') {
            console.warn(`Attempted to ensure batsman with invalid playerId: ${playerId}`);
            return;
        }
        if (!this.batsmen.has(playerId)) {
            this.batsmen.set(playerId, new Batsman(playerId));
        }
    }

    private ensureBowlerStarted(playerId: string) {
        if (!playerId || playerId === 'undefined') {
            console.warn(`Attempted to ensure bowler with invalid playerId: ${playerId}`);
            return;
        }
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

        const isWideOrNoBall = extrasType === "wide" || extrasType === "no-ball";
        const isLegalBall = !isWideOrNoBall;

        const totalRunsOnBall = runs + extrasRuns;
        this.runs += totalRunsOnBall;

        this.deliveries += 1;

        if (isLegalBall) {
            this.legalBalls += 1;
        }

        // Update Extras Entity
        if (extrasType) {
            this.extras.add(extrasType as ExtraType, extrasRuns);
        }

        if (extrasType !== "wide") {
            striker.addRuns(runs);
            if (isLegalBall) striker.addBallFaced();
        }

        bowler.addRunsConceded(totalRunsOnBall);
        if (isLegalBall) {
            bowler.addLegalBall();
        }

        if (payload.dismissal) {
            this.handleDismissalLogic(payload.dismissal, bowler);
        }

        const log: BallLog = {
            ...payload,
            extrasType: payload.extrasType as ExtraType,
            isLegalBall: isLegalBall,
            extrasRuns: extrasRuns,
            over: this.overNumber,
            ballInOver: this.deliveryInOver,
            nonStrikerId: this.currentNonStriker,
            timestamp: Date.now()
        };
        this.logs.push(log);

        this.handleStrikeRotation(runs, isLegalBall);
    }

    addExtras(payload: AddExtrasPayload) {
        if (this.isCompleted) return;

        this.runs += payload.runs;
        this.deliveries += 1;

        this.extras.add(payload.type as ExtraType, payload.runs);

        const log: BallLog = {
            strikerId: this.currentStriker,
            bowlerId: this.currentBowler,
            runs: 0,
            extrasRuns: payload.runs,
            extrasType: payload.type as ExtraType,
            isLegalBall: false,
            over: this.overNumber,
            ballInOver: this.deliveryInOver,
            nonStrikerId: this.currentNonStriker,
            timestamp: Date.now(),
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

        this.deliveries += 1;

        if (isLegalBall) {
            this.legalBalls += 1;
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
            over: this.overNumber,
            ballInOver: this.deliveryInOver,
            nonStrikerId: this.currentNonStriker,
            timestamp: Date.now(),
            nextBatsmanId,
            outWasStriker: outBatsmanId === this.currentStriker,
        });

        if (runsCompleted % 2 !== 0) this.swapStrikers();
        if (isLegalBall && this.legalBalls % 6 === 0) this.swapStrikers();
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
            over: this.overNumber,
            ballInOver: this.deliveryInOver,
            timestamp: Date.now()
        };
        this.logs.push(log);
    }

    // HELPERS

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
        if (isLegalBall && this.legalBalls > 0 && this.legalBalls % 6 === 0) {
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
        if (this.logs.length === 0) {
            return;
        }

        const lastBall = this.logs[this.logs.length - 1];

        this.logs.pop();

        // Determine if ball was legal
        const isWide = lastBall.extrasType === 'wide';
        const isNoBall = lastBall.extrasType === 'noBall';
        const isLegalBall = lastBall.isLegalBall !== undefined
            ? lastBall.isLegalBall
            : !isWide && !isNoBall;

        // ALWAYS decrement deliveries count
        this.deliveries = Math.max(0, this.deliveries - 1);

        // Only decrement legalBalls for legal deliveries
        if (isLegalBall) {
            this.legalBalls = Math.max(0, this.legalBalls - 1);
        }

        // Revert extras
        if (lastBall.extrasType && lastBall.extrasRuns) {
            this.extras.subtract(lastBall.extrasType, lastBall.extrasRuns);
        }

        // Revert total runs
        const totalRunsOnLastBall = (lastBall.runs || 0) + (lastBall.extrasRuns || 0);
        this.runs -= totalRunsOnLastBall;

        if (lastBall.dismissal) {
            const dismissalType = this.normalizeDismissalType(lastBall.dismissal.type || "");
            if (dismissalType !== 'retired-hurt') {
                this.wickets = Math.max(0, this.wickets - 1);
            }
        }

        // Revert player stats
        this.revertPlayerStats(lastBall, isLegalBall, isWide);

        // Revert striker positions
        this.revertStrikerPositions(lastBall, isLegalBall);

        // Handle over completion revert
        this.handleOverCompletionRevert(lastBall, isLegalBall);
    }

    private revertPlayerStats(lastBall: BallLog, isLegalBall: boolean, isWide: boolean) {
        const strikerId = lastBall.strikerId?.toString();
        const bowlerId = lastBall.bowlerId?.toString();

        // REVERT BATSMAN STATS
        if (strikerId && this.batsmen.has(strikerId)) {
            const striker = this.batsmen.get(strikerId)!;
            const runsToSubtract = lastBall.runs || 0;

            // Subtract runs
            striker.runs = Math.max(0, striker.runs - runsToSubtract);

            // Subtract fours/sixes
            if (lastBall.runs === 4) {
                striker.fours = Math.max(0, striker.fours - 1);
            }
            if (lastBall.runs === 6) {
                striker.sixes = Math.max(0, striker.sixes - 1);
            }

            // Subtract ball faced (only for legal balls that aren't wides)
            if (isLegalBall && !isWide) {
                striker.balls = Math.max(0, striker.balls - 1);
            }

            // Revert dismissal if batsman was out
            if (lastBall.dismissal && lastBall.dismissal.outBatsmanId?.toString() === strikerId) {
                striker.out = false;
                striker.dismissalType = undefined;
                striker.fielderId = undefined;
                striker.retiredHurt = false;
            }
        }

        // REVERT BOWLER STATS
        if (bowlerId && this.bowlers.has(bowlerId)) {
            const bowler = this.bowlers.get(bowlerId)!;
            const totalRunsToSubtract = (lastBall.runs || 0) + (lastBall.extrasRuns || 0);

            // Subtract runs conceded (including extras)
            bowler.runsConceded = Math.max(0, bowler.runsConceded - totalRunsToSubtract);

            // Subtract ball if it was a legal delivery
            if (isLegalBall) {
                bowler.totalBalls = Math.max(0, bowler.totalBalls - 1);
            }

            // Subtract wicket if bowler was credited
            const bowlerCreditedDismissals = ["bowled", "caught", "lbw", "stumped", "hit-wicket"];
            if (lastBall.dismissal && bowlerCreditedDismissals.includes(lastBall.dismissal.type)) {
                bowler.wickets = Math.max(0, bowler.wickets - 1);
            }
        }
    }

    private revertStrikerPositions(lastBall: BallLog, isLegalBall: boolean) {
        // Calculate legal balls before undo
        const legalBallsBeforeUndo = this.legalBalls + (isLegalBall ? 1 : 0);

        // 1. Revert strike rotation from odd runs
        if ((lastBall.runs || 0) % 2 !== 0) {
            this.swapStrikers();
        }

        // 2. Revert over-end rotation (only for legal balls at end of over)
        if (isLegalBall && legalBallsBeforeUndo % 6 === 0) {
            this.swapStrikers();
        }

        // 3. Handle dismissal/replacement reversal
        if (lastBall.dismissal && lastBall.dismissal.outBatsmanId && lastBall.nextBatsmanId) {
            const outId = lastBall.dismissal.outBatsmanId.toString();
            const nextId = lastBall.nextBatsmanId.toString();
            const wasStrikerOut = lastBall.outWasStriker;

            if (wasStrikerOut && this.currentStriker === nextId) {
                this.currentStriker = outId;
            } else if (!wasStrikerOut && this.currentNonStriker === nextId) {
                this.currentNonStriker = outId;
            }
        }

        // 4. Handle retired batsmen reversal
        if (lastBall.dismissal &&
            (lastBall.dismissal.type === 'retired-hurt' ||
                lastBall.dismissal.type === 'retired-out')) {

            const retiredBatsmanId = lastBall.dismissal.outBatsmanId!.toString();

            if (this.batsmen.has(retiredBatsmanId)) {
                const batsman = this.batsmen.get(retiredBatsmanId)!;
                batsman.out = false;
                batsman.dismissalType = undefined;
                batsman.retiredHurt = false;
            }

            if (lastBall.outWasStriker) {
                this.currentStriker = retiredBatsmanId;
            } else {
                this.currentNonStriker = retiredBatsmanId;
            }
        }
    }

    private handleOverCompletionRevert(lastBall: BallLog, isLegalBall: boolean) {
        const legalBallsBeforeUndo = this.legalBalls + (isLegalBall ? 1 : 0);

        // If we undid the 6th legal ball of an over, restore the current bowler
        if (isLegalBall && legalBallsBeforeUndo % 6 === 0) {
            if (lastBall.bowlerId) {
                this.currentBowler = lastBall.bowlerId.toString();
            }
        }
    }

    static fromDTO(dto): Innings {
        const innings = new Innings({
            runs: dto.runs,
            wickets: dto.wickets,
            battingTeam: dto.battingTeam,
            bowlingTeam: dto.bowlingTeam,
            legalBalls: dto.legalBalls,
            deliveries: dto.deliveries,
            isCompleted: dto.isCompleted,
            currentStriker: dto.currentStriker,
            currentNonStriker: dto.currentNonStriker,
            currentBowler: dto.currentBowler
        });

        // Rebuild batsmen
        if (Array.isArray(dto.battingStats)) {
            for (const b of dto.battingStats) {
                innings.batsmen.set(b.playerId, Batsman.fromDTO(b));
            }
        }

        // Rebuild bowlers
        if (Array.isArray(dto.bowlingStats)) {
            for (const b of dto.bowlingStats) {
                innings.bowlers.set(b.playerId, Bowler.fromDTO(b));
            }
        }

        // Restore extras
        innings.extras = Extras.fromDTO(dto.extras);

        return innings;
    }


    toDTO() {
        return {
            runs: this.runs,
            wickets: this.wickets,
            battingTeam: this.battingTeam,
            bowlingTeam: this.bowlingTeam,
            overs: this.oversFormatted,
            legalBalls: this.legalBalls,
            deliveries: this.deliveries,
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
