import React from 'react';
import { type TeamScore } from './MatchTypes'; 

interface ScoreboardProps {
    teamScore: TeamScore;
    lastFiveBalls: (number | 'W' | 'Nb' | 'Wd' | '0')[];
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teamScore, lastFiveBalls }) => {
    const getBallColor = (ball: string | number) => {
        if (ball === 4 || ball === 6) return 'bg-green-600';
        if (ball === 'W') return 'bg-red-600';
        if (ball === 'Wd' || ball === 'Nb') return 'bg-yellow-600';
        return 'bg-neutral-700';
    };

    return (
        <div className="bg-neutral-800 p-6 rounded-xl shadow-2xl border-t-4 border-indigo-500">
            <h2 className="text-2xl font-semibold mb-4 text-neutral-200">{teamScore.name}</h2>
            <div className="flex justify-between items-end">
                <p className="text-6xl font-extrabold text-white">
                    {teamScore.totalRuns}<span className="text-4xl text-indigo-400">/{teamScore.wickets}</span>
                </p>
                <div className="text-right">
                    <p className="text-xl font-medium text-neutral-400">Overs: **{teamScore.overs.toFixed(1)}**</p>
                    <div className="mt-2 text-sm space-x-1 flex justify-end">
                        <span className='text-neutral-400 mr-2'>Last 5:</span>
                        {lastFiveBalls.map((ball, index) => (
                            <span
                                key={index}
                                className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getBallColor(ball)}`}
                            >
                                {ball}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scoreboard;