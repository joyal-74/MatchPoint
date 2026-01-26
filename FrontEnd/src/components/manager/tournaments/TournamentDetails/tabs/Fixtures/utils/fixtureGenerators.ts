import { shuffleTeams } from "../../../../../../../utils/helpers/TeamSuffler";
import type { RegisteredTeam } from "../../TabContent";

export interface Match {
    matchNumber: number;
    teamA: string;
    teamB: string;
    round: number;
    status: "ongoing" | "completed" | "upcoming" | "bye";
    winner: string | null;
    venue?: string;
    date?: Date;
    stats: Record<string, unknown>;
}

function assignMatchDates<T extends Match>(matches: T[], startDate: string | Date, matchesPerDay: number): T[] {
    const start = new Date(startDate);
    let dayOffset = 0;
    let count = 0;

    return matches.map((match) => {
        if (count >= matchesPerDay) {
            dayOffset++;
            count = 0;
        }

        const matchDate = new Date(start);
        matchDate.setDate(start.getDate() + dayOffset);

        count++;
        return { ...match, date: matchDate };
    });
}


export function generateKnockoutFixtures(teams: RegisteredTeam[], location: string, startDate: string | Date, matchesPerDay: number): Match[] {
    const shuffled = shuffleTeams([...teams]);
    const matches: Match[] = [];
    let matchNumber = 1;

    for (let i = 0; i < shuffled.length; i += 2) {
        const teamA = shuffled[i];
        const teamB = shuffled[i + 1];

        if (!teamB) {
            matches.push({
                matchNumber: matchNumber++,
                teamA: teamA.teamId,
                teamB: "",
                round: 1,
                status: "bye",
                venue: location,
                winner: teamA.teamId,
                stats: {},
            });
        } else {
            matches.push({
                matchNumber: matchNumber++,
                teamA: teamA.teamId,
                teamB: teamB.teamId,
                round: 1,
                venue: location,
                status: "upcoming",
                winner: null,
                stats: {},
            });
        }
    }

    return assignMatchDates(matches, startDate, matchesPerDay);
}


export function generateLeagueFixtures(teams: RegisteredTeam[], location: string, startDate: string | Date, matchesPerDay: number): Match[] {
    const matches: Match[] = [];
    let matchNumber = 1;

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({
                matchNumber: matchNumber++,
                teamA: teams[i].teamId,
                teamB: teams[j].teamId,
                round: 1,
                venue: location,
                status: "upcoming",
                winner: null,
                stats: {},
            });
        }
    }

    return assignMatchDates(matches, startDate, matchesPerDay);
}


export function generateFriendlyFixture(teams: RegisteredTeam[], location: string, startDate: string | Date,): Match[] {
    const shuffled = shuffleTeams([...teams]);
    return [
        {
            matchNumber: 1,
            teamA: shuffled[0].teamId,
            teamB: shuffled[1].teamId,
            round: 1,
            venue: location,
            date: new Date(startDate),
            status: "upcoming",
            winner: null,
            stats: {},
        },
    ];
}
