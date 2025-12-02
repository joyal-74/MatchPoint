import React, { useState } from 'react';

// Ensure all imports are correct based on your file structure
import type {
    MatchState,
    TeamScore,
    BatsmanStats,
    BowlerStats,
    ScoreUpdateHandler,
    InningsDetails
} from './MatchTypes';

import Scoreboard from './Scoreboard';
import ScoreControlPanel from './ScoreControlPanel';
import BatsmanTable from './BatsmanTable';
import FullScorecard from './FullScorecard';
import Navbar from '../../Navbar';


// ------------------ INITIAL DUMMY DATA ------------------

const initialBatsmen: BatsmanStats[] = [
    { id: 1, name: 'B. Kohli', runs: 12, balls: 8, fours: 1, sixes: 0, isStriker: true, outDescription: null },
    { id: 2, name: 'R. Sharma', runs: 5, balls: 3, fours: 0, sixes: 1, isStriker: false, outDescription: null },
];

const initialBowler: BowlerStats = {
    id: 10, name: 'T. Boult', overs: 1, maidens: 0, runsConceded: 10, wickets: 0
};

const initialTeamA: TeamScore = {
    name: 'Team India',
    totalRuns: 17,
    wickets: 0,
    overs: 1.0,
    batsmen: initialBatsmen,
    currentBowler: initialBowler
};

const initialMatchState: MatchState = {
    currentInnings: 'TeamA',
    teamA: initialTeamA,
    teamB: {} as TeamScore,
    lastFiveBalls: [1, 0, 4, 0, 2],
    innings1: null,
    innings2: null,
    matchResult: null,
};


// ------------------ MAIN PAGE COMPONENT ------------------

const MatchControlPage: React.FC = () => {
    const [matchState, setMatchState] = useState<MatchState>(initialMatchState);

    const isMatchOver = matchState.matchResult !== null;


    // ------------------ END INNINGS / MATCH ------------------

    const handleEndInnings = () => {
        const finalized: InningsDetails = {
            name: 'Team A',
            totalRuns: 200,
            wickets: 8,
            overs: 20,
            batsmenScore: initialBatsmen.map(b => ({
                ...b,
                outDescription: b.id === 1 ? 'c B b A' : 'run out',
                isStriker: false
            })),
            bowlersScore: [
                initialBowler,
                { id: 11, name: 'S. Smith', overs: 4, maidens: 0, runsConceded: 35, wickets: 2 }
            ],
            extras: { wides: 5, noBalls: 1, byes: 4, legByes: 0 }
        };

        setMatchState(prev => ({
            ...prev,
            innings1: finalized,
            innings2: finalized,
            matchResult: 'Team A won by 5 wickets!'
        }));
    };


    // ------------------ SCORE UPDATE ------------------
    const handleScoreUpdate: ScoreUpdateHandler = (type, value = 0) => {
        setMatchState(prev => {
            const currentTeamKey = prev.currentInnings === 'TeamA' ? 'teamA' : 'teamB';
            const currentTeam = prev[currentTeamKey];

            let newTotal = currentTeam.totalRuns;
            let newWickets = currentTeam.wickets;
            let newOvers = currentTeam.overs;
            let newFeed = [...prev.lastFiveBalls];

            const batsmen = currentTeam.batsmen;
            const striker = batsmen.find(b => b.isStriker);
            const nonStriker = batsmen.find(b => !b.isStriker);

            if (!striker || !nonStriker) return prev;

            const ballsInOver = Math.round((newOvers - Math.floor(newOvers)) * 10);
            let newBalls = ballsInOver + 1;

            const legal = type !== 'extra' && type !== 'swap';

            if (legal) {
                if (newBalls === 6) {
                    newOvers = Math.floor(newOvers) + 1.0;
                } else {
                    newOvers = Math.floor(newOvers) + newBalls / 10;
                }
            } else {
                newBalls -= 1;
            }

            switch (type) {
                case 'run':
                    newTotal += value;
                    striker.runs += value;
                    striker.balls += 1;
                    newFeed.push(value);
                    if (value % 2 !== 0) {
                        striker.isStriker = false;
                        nonStriker.isStriker = true;
                    }
                    break;

                case 'extra':
                    newTotal += value;
                    newFeed.push(value === 1 ? 'Wd' : 'Nb');
                    break;

                case 'wicket':
                    newWickets += 1;
                    striker.balls += 1;
                    striker.outDescription =
                        `OUT: Wicket by ${currentTeam.currentBowler.name}`;
                    currentTeam.currentBowler.wickets += 1;
                    newFeed.push('W');
                    break;

                case 'swap':
                    striker.isStriker = false;
                    nonStriker.isStriker = true;
                    break;
            }

            if (newFeed.length > 5) newFeed = newFeed.slice(-5);

            if (newBalls === 6 && legal) {
                striker.isStriker = false;
                nonStriker.isStriker = true;
            }

            return {
                ...prev,
                [currentTeamKey]: {
                    ...currentTeam,
                    totalRuns: newTotal,
                    wickets: newWickets,
                    overs: parseFloat(newOvers.toFixed(1))
                },
                lastFiveBalls: newFeed
            };
        });
    };


    // ------------------ PAGE RENDER ------------------

    return (
        <>

            <Navbar />

            <div className="pt-20 mx-12 bg-neutral-900 text-neutral-100">

                {/* MATCH OVER → ONLY FULL SCORECARD */}
                {isMatchOver && (
                    <>
                        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-400">
                            Final Match Scorecard
                        </h1>

                        <FullScorecard matchState={matchState} />
                    </>
                )}

                {/* LIVE MODE → LIVE PANELS + FULL SCORECARD BELOW */}
                {!isMatchOver && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* LEFT PANEL - LIVE SCOREBOARD */}
                            <div className="lg:col-span-2 space-y-8">
                                <Scoreboard
                                    teamScore={matchState.teamA}
                                    lastFiveBalls={matchState.lastFiveBalls}
                                />
                                <BatsmanTable batsmen={matchState.teamA.batsmen} />
                            </div>

                            {/* RIGHT PANEL - CONTROLS */}
                            <div className="lg:col-span-1 space-y-8">
                                <ScoreControlPanel
                                    handleScoreUpdate={handleScoreUpdate}
                                    currentBowler={matchState.teamA.currentBowler}
                                />

                                <button
                                    onClick={handleEndInnings}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                                >
                                    End Match / Generate Final Scorecard
                                </button>
                            </div>
                        </div>

                        {/* FULL SCORECARD EVEN DURING LIVE MODE */}
                        <div className="py-8">
                            <FullScorecard matchState={matchState} />
                        </div>
                    </>
                )}

            </div>
        </>

    );
};

export default MatchControlPage;
