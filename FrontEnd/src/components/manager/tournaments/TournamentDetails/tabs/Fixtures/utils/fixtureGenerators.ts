import { shuffleTeams } from "../../../../../../../utils/helpers/TeamSuffler";
import type { RegisteredTeam } from "../../TabContent";

export interface Match {
    matchNumber: number;
    teamA: string;
    teamB: string;
    round: number;
    status: 'ongoing' | 'completed' | 'upcoming' | 'bye';
    winner: string;
    stats: Record<string, any>;
}

export function generateKnockoutFixtures(teams: RegisteredTeam[]): Match[] {
    const shuffled = shuffleTeams([...teams]);
    console.log(shuffleTeams, " skdfhsdf")
    const matches: Match[] = [];
    let matchNumber = 1;

    for (let i = 0; i < shuffled.length; i += 2) {
        const teamA = shuffled[i];
        const teamB = shuffled[i + 1];

        if (!teamB) {

            matches.push({
                matchNumber: matchNumber++,
                teamA: teamA.teamId,
                teamB: '',
                round: 1,
                status: "bye",
                winner: teamA.teamId,
                stats: {}
            });
        } else {
            matches.push({
                matchNumber: matchNumber++,
                teamA: teamA.teamId,
                teamB: teamB.teamId,
                round: 1,
                status: "upcoming",
                winner: '',
                stats: {}
            });
        }
    }

    return matches;
}



export function generateLeagueFixtures(teams: RegisteredTeam[]): Match[] {
    const matches: Match[] = [];
    let matchNumber = 1;
    // const totalRounds = teams.length - 1;

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({
                matchNumber: matchNumber++,
                teamA: teams[i].teamId,
                teamB: teams[j].teamId,
                round: 1,
                status: "upcoming",
                winner: '',
                stats: {}
            });
        }
    }

    return matches;
}

export function generateFriendlyFixture(teams: RegisteredTeam[]): Match[] {
    const shuffled = shuffleTeams([...teams]);
    return [
        {
            matchNumber: 1,
            teamA: shuffled[0].teamId,
            teamB: shuffled[1].teamId,
            round: 1,
            status: "upcoming",
            winner: '',
            stats: {}
        }
    ];
}
