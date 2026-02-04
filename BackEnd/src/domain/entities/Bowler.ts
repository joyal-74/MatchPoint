export class Bowler {
    public totalBalls = 0;

    constructor(
        public playerId: string,
        public runsConceded = 0,
        public wickets = 0,
        public maidens = 0
    ) { }

    addRunsConceded(n: number) {
        this.runsConceded += n;
    }


    addLegalBall() {
        this.totalBalls += 1;
    }

    addWicket() {
        this.wickets += 1;
    }

    resetStats() {
        this.totalBalls = 0;
        this.runsConceded = 0;
        this.wickets = 0;
        this.maidens = 0;
    }

    static fromDTO(dto): Bowler {
        const b = new Bowler(dto.playerId);
        Object.assign(b, dto);
        return b;
    }


    toDTO() {
        const completedOvers = Math.floor(this.totalBalls / 6);
        const ballsInOver = this.totalBalls % 6;

        return {
            playerId: this.playerId,
            runsConceded: this.runsConceded,
            wickets: this.wickets,
            balls: this.totalBalls,
            overs: `${completedOvers}.${ballsInOver}`,
            economy: this.totalBalls > 0 ? (this.runsConceded / (this.totalBalls / 6)).toFixed(2) : "0.00"
        };
    }
}
