export type ExtraType = "wide" | "noBall" | "bye" | "legBye" | "penalty" | null;

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

    get total() {
        return this.wides + this.noBalls + this.byes + this.legByes + this.penalty;
    }
}
