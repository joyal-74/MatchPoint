import React from 'react';
import type { Team } from '../../../../features/manager/Matches/matchTypes';

interface MatchSetupSelectionProps {
    teamA: Team;
    teamB: Team;
    selection: { strikerId: number | null; nonStrikerId: number | null; bowlerId: number | null; };
    setSelection: React.Dispatch<React.SetStateAction<{ strikerId: number | null; nonStrikerId: number | null; bowlerId: number | null; }>>;
    onStartMatch: () => void;
}

const MatchSetupSelection: React.FC<MatchSetupSelectionProps> = ({ 
    teamA, 
    teamB, 
    selection, 
    setSelection, 
    onStartMatch 
}) => {
    
    const isReadyToStart = selection.strikerId && selection.nonStrikerId && selection.bowlerId && (selection.strikerId !== selection.nonStrikerId);
    
    const handleSelectChange = (key: 'strikerId' | 'nonStrikerId' | 'bowlerId', value: string) => {
        setSelection(prev => ({ 
            ...prev, 
            [key]: parseInt(value) || null 
        }));
    };

    const BatsmenOptions = teamA.members.map(p => (
        <option key={p._id} value={p._id}>{p.name}</option>
    ));

    const BowlerOptions = teamB.members.map(p => (
        <option key={p._id} value={p._id}>{p.name}</option>
    ));

    return (
        <div className="pt-20 mx-12 bg-neutral-900 text-neutral-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 text-center text-yellow-400">
                🏟️ Match Setup: Select Starting Players
            </h2>
            <div className="max-w-xl mx-auto p-6 bg-neutral-800 rounded-lg shadow-xl space-y-6">
                
                {/* STRIKER SELECTION */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2 text-indigo-300">
                        Batting Team: {teamA.name} | Select **Striker**
                    </label>
                    <select 
                        className="p-3 rounded bg-neutral-700 text-white"
                        value={selection.strikerId || ''}
                        onChange={(e) => handleSelectChange('strikerId', e.target.value)}
                    >
                        <option value="" disabled>Select the Striker</option>
                        {BatsmenOptions}
                    </select>
                </div>

                {/* NON-STRIKER SELECTION */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2 text-indigo-300">
                        Select **Non-Striker**
                    </label>
                    <select 
                        className="p-3 rounded bg-neutral-700 text-white"
                        value={selection.nonStrikerId || ''}
                        onChange={(e) => handleSelectChange('nonStrikerId', e.target.value)}
                    >
                        <option value="" disabled>Select the Non-Striker</option>
                        {BatsmenOptions.filter(opt => parseInt(opt.props.value) !== selection.strikerId)}
                    </select>
                    {selection.strikerId === selection.nonStrikerId && selection.strikerId && (
                         <p className="text-red-400 text-sm mt-1">Striker and Non-Striker must be different players.</p>
                    )}
                </div>
                
                {/* BOWLER SELECTION */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2 text-green-300">
                        Bowling Team: {teamB.name} | Select **Opening Bowler**
                    </label>
                    <select 
                        className="p-3 rounded bg-neutral-700 text-white"
                        value={selection.bowlerId || ''}
                        onChange={(e) => handleSelectChange('bowlerId', e.target.value)}
                    >
                        <option value="" disabled>Select the Opening Bowler</option>
                        {BowlerOptions}
                    </select>
                </div>

                <button
                    onClick={onStartMatch}
                    disabled={!isReadyToStart}
                    className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
                        isReadyToStart 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-neutral-600 cursor-not-allowed'
                    }`}
                >
                    Start Match
                </button>

            </div>
        </div>
    );
};

export default MatchSetupSelection;