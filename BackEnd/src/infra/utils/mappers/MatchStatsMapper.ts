import { MatchEntity } from "domain/entities/MatchEntity";
import { BatsmanStat, BowlerStat, InningsDTO, TournamentMatchStatsDocument } from "domain/types/match.types";
import { Innings } from "domain/entities/Innings";
import { Batsman } from "domain/entities/Batsman";
import { Bowler } from "domain/entities/Bowler";
import { Extras } from "domain/entities/Extra";

export class MatchStatsMapper {
    static mapInnings(doc: InningsDTO | null | undefined): Innings | null {
        if (!doc) return null;

        const innings = new Innings();

        (doc.batsmen || []).forEach((b: BatsmanStat) => {
            const batsman = new Batsman(
                String(b.playerId),
                b.runs,
                b.balls,
                b.fours,
                b.sixes,
                b.out,
                b.dismissalType,
                b.fielderId,
                b.retiredHurt
            );

            innings.batsmen.set(String(b.playerId), batsman);
        });

        (doc.bowlers || []).forEach((bw: BowlerStat) => {
            const bowler = new Bowler(
                String(bw.playerId),
                bw.runsConceded,
                bw.wickets,
                0
            );

            bowler.totalBalls = bw.balls;

            innings.bowlers.set(String(bw.playerId), bowler);
        });


        const extrasDomain = new Extras();
        if (doc.extras) {
            extrasDomain.wides = doc.extras.wides || 0;
            extrasDomain.noBalls = doc.extras.noBalls || 0;
            extrasDomain.byes = doc.extras.byes || 0;
            extrasDomain.legByes = doc.extras.legByes || 0;
            extrasDomain.penalty = doc.extras.penalty || 0;
        }
        innings.extras = extrasDomain;
        // ---- FIX END ----

        innings.logs = doc.logs ?? [];

        innings.runs = doc.runs ?? 0;
        innings.wickets = doc.wickets ?? 0;
        innings.balls = doc.balls ?? 0;
        innings.isCompleted = doc.isCompleted ?? false;

        innings.currentBowler = doc.currentBowler ? String(doc.currentBowler) : undefined;
        innings.currentStriker = doc.currentStriker ? String(doc.currentStriker) : undefined;
        innings.currentNonStriker = doc.currentNonStriker ? String(doc.currentNonStriker) : undefined;

        innings.battingTeam = doc.battingTeam ?? undefined;
        innings.bowlingTeam = doc.bowlingTeam ?? undefined;

        return innings;
    }

    static toDomain(doc: TournamentMatchStatsDocument): MatchEntity {
        const innings1 = this.mapInnings(doc.innings1) ?? new Innings();
        const innings2 = this.mapInnings(doc.innings2);

        return new MatchEntity({
            tournamentId: String(doc.tournamentId),
            matchId: String(doc.matchId),
            oversLimit: doc.oversLimit,
            innings1,
            innings2,
            currentInnings: doc.currentInnings,
            hasSuperOver: doc.hasSuperOver
        });
    }

    static toPersistence(match: MatchEntity) {
        const mapInningsToPersistence = (inn: Innings | null) => {
            if (!inn) return null;

            return {
                battingTeam: inn.battingTeam,
                bowlingTeam: inn.bowlingTeam,
                runs: inn.runs || 0,
                wickets: inn.wickets,
                balls: inn.balls,
                isCompleted: inn.isCompleted,

                currentStriker: inn.currentStriker,
                currentNonStriker: inn.currentNonStriker,
                currentBowler: inn.currentBowler,

                batsmen: Array.from(inn.batsmen.values()).map(b => ({
                    playerId: b.playerId,
                    runs: b.runs,
                    balls: b.balls,
                    fours: b.fours,
                    sixes: b.sixes,
                    out: b.out,
                    dismissalType: b.dismissalType,
                    fielderId: b.fielderId,
                    retiredHurt: b.retiredHurt
                })),

                bowlers: Array.from(inn.bowlers.values()).map(bw => ({
                    playerId: bw.playerId,
                    overs: Number(`${Math.floor(bw.totalBalls / 6)}.${bw.totalBalls % 6}`),
                    balls: bw.totalBalls,
                    runsConceded: bw.runsConceded,
                    wickets: bw.wickets
                })),

                extras: inn.extras,
                logs: inn.logs
            };
        };

        return {
            tournamentId: match.tournamentId,
            matchId: match.matchId,
            innings1: mapInningsToPersistence(match.innings1),
            innings2: mapInningsToPersistence(match.innings2 ?? null),
            oversLimit: match.oversLimit,
            currentInnings: match.currentInningsNumber,
            hasSuperOver: match.hasSuperOver
        };
    }
}