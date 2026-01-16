
export const useMockCricketMatches = () => {
    return [
        {
            id: 1,
            teamA: "Thunder Strikers",
            teamB: "Kerala Blasters",
            date: new Date().toISOString(), 
            status: "live", 
            round: "Final",
            scoreA: "165/4",
            oversA: "20.0",
            scoreB: "142/6",
            oversB: "16.4",
            batting: "teamB", 
            target: 166,
            toss: "Kerala Blasters won toss & chose to bowl"
        },
        {
            id: 2,
            teamA: "Royal Challengers",
            teamB: "Mumbai City",
            date: new Date(Date.now() - 86400000).toISOString(),
            status: "completed",
            round: "Semi Final 1",
            scoreA: "185/6",
            oversA: "20.0",
            scoreB: "182/9",
            oversB: "20.0",
            result: "Royal Challengers won by 3 runs",
            toss: "Royal Challengers won toss & chose to bat"
        },
        {
            id: 3,
            teamA: "Titans FC",
            teamB: "Warriors XI",
            date: new Date(Date.now() + 86400000).toISOString(),
            status: "upcoming",
            round: "Semi Final 2",
            toss: null,
            scoreA: null,
            scoreB: null
        }
    ];
};

// --- 2. MOCK POINTS TABLE ---
export const useMockPointsTable = () => {
    return [
        { rank: 1, team: "Thunder Strikers", p: 10, w: 8, l: 2, nrr: "+1.250", pts: 16, form: ['W','W','L','W','W'] },
        { rank: 2, team: "Royal Challengers", p: 10, w: 7, l: 3, nrr: "+0.850", pts: 14, form: ['L','W','W','W','L'] },
        { rank: 3, team: "Kerala Blasters", p: 10, w: 6, l: 4, nrr: "+0.410", pts: 12, form: ['W','L','L','W','W'] },
        { rank: 4, team: "Mumbai City", p: 10, w: 5, l: 5, nrr: "-0.120", pts: 10, form: ['L','L','W','L','W'] },
        { rank: 5, team: "Titans FC", p: 10, w: 3, l: 7, nrr: "-0.850", pts: 6, form: ['L','L','L','W','L'] },
        { rank: 6, team: "Warriors XI", p: 10, w: 1, l: 9, nrr: "-1.550", pts: 2, form: ['L','L','L','L','L'] },
    ];
};

// --- 3. MOCK STATS ---
export const useMockStats = () => {
    return {
        orangeCap: { player: "Virat K.", team: "Royal Challengers", value: "540 Runs", subValue: "Avg: 60.0 • SR: 145" },
        purpleCap: { player: "Jasprit B.", team: "Mumbai City", value: "24 Wickets", subValue: "Eco: 6.5 • Best: 5/12" },
        mvp: { player: "Ben Stokes", team: "Thunder Strikers", value: "350 Runs & 12 Wkts", subValue: "All-Round Performance" }
    };
};