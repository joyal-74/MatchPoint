import { PlayerModel } from "../../../../infra/databases/mongo/models/PlayerModel";
import { TournamentMatchStatsModel } from "../../../../infra/databases/mongo/models/TournamentStatsModel";


export const updatePlayerStatsFromMatch = async (matchStatsId: string) => {
    const stats = await TournamentMatchStatsModel.findById(matchStatsId);
    if (!stats) return;

    const innings = [stats.innings1, stats.innings2].filter(Boolean) as any[];

    for (const inn of innings) {

        // Update Batsmen
        for (const b of inn.batsmen) {
            await PlayerModel.updateOne(
                { _id: b.playerId },
                {
                    $inc: {
                        "stats.batting.innings": 1,
                        "stats.batting.runs": b.runs,
                        "stats.batting.fours": b.fours,
                        "stats.batting.sixes": b.sixes
                    }
                }
            );
        }

        // Update Bowlers
        for (const bw of inn.bowlers) {
            await PlayerModel.updateOne(
                { _id: bw.playerId },
                {
                    $inc: {
                        "stats.bowling.ballsBowled": (bw.overs * 6 + bw.balls),
                        "stats.bowling.runsConceded": bw.runsConceded,
                        "stats.bowling.wickets": bw.wickets
                    }
                }
            );
        }
    }
};
