export type ExtraType = | "wide" | "noBall" | "bye" | "legBye" | "penalty";

export class Extras {
    wides = 0;
    noBalls = 0;
    byes = 0;
    legByes = 0;
    penalty = 0;

    add(type: ExtraType, runs: number) {
        if (!type) return;
        switch (type) {
            case "wide": this.wides += runs; break;
            case "noBall": this.noBalls += runs; break;
            case "bye": this.byes += runs; break;
            case "legBye": this.legByes += runs; break;
            case "penalty": this.penalty += runs; break;
        }
    }

    subtract(type: ExtraType, runs: number) {
        if (!type) return;
        switch (type) {
            case "wide": this.wides = Math.max(0, this.wides - runs); break;
            case "noBall": this.noBalls = Math.max(0, this.noBalls - runs); break;
            case "bye": this.byes = Math.max(0, this.byes - runs); break;
            case "legBye": this.legByes = Math.max(0, this.legByes - runs); break;
            case "penalty": this.penalty = Math.max(0, this.penalty - runs); break;
        }
    }

    get total() {
        return this.wides + this.noBalls + this.byes + this.legByes + this.penalty;
    }

    static fromDTO(dto): Extras {
        const e = new Extras();
        Object.assign(e, dto);
        return e;
    }
}
