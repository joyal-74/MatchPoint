export interface Team {
    _id: string;
    teamId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    description: string;
    maxPlayers: number;
    members: string[];
    state: string;
    city: string;
    stats: {
        totalMatches: number;
        winRate: number;
    };
    phase: "recruiting" | "active" | "completed";
    created: string;
}

// Sample team data
export const sampleTeams: Team[] = [
    {
        _id: "1",
        teamId: "TM001",
        managerId: "user1",
        name: "Thunder Hawks",
        logo: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200&h=200&fit=crop&crop=center",
        sport: "Basketball",
        description: "A competitive basketball team focused on teamwork and sportsmanship. We practice twice a week and participate in local tournaments. Looking for dedicated players who want to improve their skills while having fun.",
        maxPlayers: 12,
        members: ["1", "2", "3", "4", "5", "6", "7", "8"],
        state: "California",
        city: "Los Angeles",
        stats: {
            totalMatches: 24,
            winRate: 75
        },
        phase: "recruiting",
        created: "2024-01-15T00:00:00Z"
    },
    {
        _id: "2",
        teamId: "TM002",
        managerId: "user2",
        name: "Storm Riders",
        logo: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&h=200&fit=crop&crop=center",
        sport: "Soccer",
        description: "Professional soccer team competing in regional leagues. We emphasize technical skills, tactical awareness, and physical fitness. Regular training sessions and friendly matches.",
        maxPlayers: 18,
        members: ["9", "10", "11", "12", "13", "14", "15"],
        state: "New York",
        city: "Brooklyn",
        stats: {
            totalMatches: 18,
            winRate: 62
        },
        phase: "active",
        created: "2024-02-10T00:00:00Z"
    },
    {
        _id: "3",
        teamId: "TM003",
        managerId: "user3",
        name: "Ice Warriors",
        logo: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&h=200&fit=crop&crop=center",
        sport: "Ice Hockey",
        description: "Competitive ice hockey team with experienced players. We play in the regional winter league and are always looking for skilled players to join our roster.",
        maxPlayers: 20,
        members: ["16", "17", "18", "19", "20", "21"],
        state: "Michigan",
        city: "Detroit",
        stats: {
            totalMatches: 15,
            winRate: 80
        },
        phase: "recruiting",
        created: "2024-03-05T00:00:00Z"
    },
    {
        _id: "4",
        teamId: "TM004",
        managerId: "user4",
        name: "Volley Titans",
        logo: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200&h=200&fit=crop&crop=center",
        sport: "Volleyball",
        description: "Beach and indoor volleyball team. We compete in local tournaments and organize regular practice sessions. All skill levels welcome!",
        maxPlayers: 10,
        members: ["22", "23", "24", "25", "26"],
        state: "Florida",
        city: "Miami",
        stats: {
            totalMatches: 12,
            winRate: 58
        },
        phase: "active",
        created: "2024-01-28T00:00:00Z"
    },
    {
        _id: "5",
        teamId: "TM005",
        managerId: "user5",
        name: "Baseball Legends",
        logo: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=200&h=200&fit=crop&crop=center",
        sport: "Baseball",
        description: "Community baseball team with a focus on developing young talent. We participate in summer leagues and organize training camps for beginners.",
        maxPlayers: 15,
        members: ["27", "28", "29", "30", "31", "32", "33"],
        state: "Texas",
        city: "Houston",
        stats: {
            totalMatches: 20,
            winRate: 45
        },
        phase: "completed",
        created: "2024-02-20T00:00:00Z"
    },
    {
        _id: "6",
        teamId: "TM006",
        managerId: "user6",
        name: "Rugby United",
        logo: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=200&h=200&fit=crop&crop=center",
        sport: "Rugby",
        description: "Hard-hitting rugby team with international coaching staff. We compete in national tournaments and have a strong focus on player development.",
        maxPlayers: 25,
        members: ["34", "35", "36", "37", "38", "39", "40", "41", "42"],
        state: "Illinois",
        city: "Chicago",
        stats: {
            totalMatches: 30,
            winRate: 85
        },
        phase: "recruiting",
        created: "2024-03-15T00:00:00Z"
    }
];

// Sample team for the detailed view
export const sampleTeam: Team = {
    _id: "1",
    teamId: "TM001",
    managerId: "user1",
    name: "Thunder Hawks",
    logo: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200&h=200&fit=crop&crop=center",
    sport: "Basketball",
    description: "A competitive basketball team focused on teamwork and sportsmanship. We practice twice a week and participate in local tournaments. Looking for dedicated players who want to improve their skills while having fun.",
    maxPlayers: 15,
    members: ["1", "2", "3", "4", "5", "6", "7", "8"],
    state: "California",
    city: "Los Angeles",
    stats: {
        totalMatches: 24,
        winRate: 75
    },
    phase: "recruiting",
    created: "2024-01-15T00:00:00Z"
};