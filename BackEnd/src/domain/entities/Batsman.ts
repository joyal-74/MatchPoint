export class Batsman {
    constructor(
        public playerId: string,
        public runs = 0,
        public balls = 0,
        public fours = 0,
        public sixes = 0,
        public out = false,
        public dismissalType?: string,
        public fielderId?: string,
        public retiredHurt = false
    ) { }

    addRuns(n: number) {
        this.runs += n;
        if (n === 4) this.fours += 1;
        if (n === 6) this.sixes += 1;
    }

    addBallFaced() {
        this.balls += 1;
    }

    setOut(type: string, fielderId?: string) {
        this.out = true;
        this.dismissalType = type;
        this.fielderId = fielderId;
    }

    resetStats() {
        this.runs = 0;
        this.balls = 0;
        this.fours = 0;
        this.sixes = 0;
        this.out = false;
        this.dismissalType = undefined;
        this.fielderId = undefined;
        this.retiredHurt = false;
    }

    static fromDTO(dto): Batsman {
        const b = new Batsman(dto.playerId);
        Object.assign(b, dto);
        return b;
    }

    toDTO() {
        return {
            playerId: this.playerId,
            runs: this.runs,
            balls: this.balls,
            fours: this.fours,
            sixes: this.sixes,
            strikeRate: this.balls > 0 ? ((this.runs / this.balls) * 100).toFixed(2) : "0.00",
            out: this.out,
            dismissal: this.out ? {
                type: this.dismissalType,
                fielderId: this.fielderId
            } : null
        };
    }
}
