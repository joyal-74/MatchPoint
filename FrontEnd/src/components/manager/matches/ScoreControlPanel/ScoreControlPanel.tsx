import React from 'react';
import type { ScoreUpdateHandler, BowlerStats } from './MatchTypes';

interface ScoreControlPanelProps {
  handleScoreUpdate: ScoreUpdateHandler;
  currentBowler: BowlerStats;
}

const ScoreControlPanel: React.FC<ScoreControlPanelProps> = ({ handleScoreUpdate, currentBowler }) => {
  const baseStyle = "text-white font-bold py-4 rounded-lg shadow-md transition duration-200";

  return (
    <div className="bg-neutral-800 p-6 rounded-xl shadow-2xl space-y-6">
      <div className="pb-4 border-b border-neutral-700">
        <h3 className="text-xl font-semibold text-indigo-400 mb-2">Current Bowler</h3>
        <p className="text-lg font-medium">{currentBowler.name}</p>
        <p className="text-sm text-neutral-400">Overs: {currentBowler.overs.toFixed(1)} - Wkts: {currentBowler.wickets} - Runs: {currentBowler.runsConceded}</p>
      </div>

      <h3 className="text-xl font-semibold text-neutral-200">Live Score Events</h3>
      <div className="grid grid-cols-3 gap-3">
        {/* Run Buttons */}
        <button onClick={() => handleScoreUpdate('run', 1)} className={`${baseStyle} bg-red-600/50 border-1 border-red-800 hover:bg-blue-700`}>1 Run</button>
        <button onClick={() => handleScoreUpdate('run', 2)} className={`${baseStyle} bg-blue-600 hover:bg-blue-700`}>2 Runs</button>
        <button onClick={() => handleScoreUpdate('run', 3)} className={`${baseStyle} bg-blue-600 hover:bg-blue-700`}>3 Runs</button>
        
        <button onClick={() => handleScoreUpdate('run', 4)} className={`${baseStyle} bg-green-600 hover:bg-green-700`}>4 Runs</button>
        <button onClick={() => handleScoreUpdate('run', 6)} className={`${baseStyle} bg-green-600 hover:bg-green-700`}>6 Runs</button>
        
        {/* Wicket */}
        <button onClick={() => handleScoreUpdate('wicket')} className={`${baseStyle} bg-red-600 hover:bg-red-700`}>WICKET</button>

        {/* Extras & Control */}
        <button onClick={() => handleScoreUpdate('extra', 1)} className={`${baseStyle} bg-yellow-600 hover:bg-yellow-700`}>WIDE (+1)</button>
        <button onClick={() => handleScoreUpdate('extra', 1)} className={`${baseStyle} bg-yellow-600 hover:bg-yellow-700`}>NO-BALL (+1)</button>
        <button onClick={() => handleScoreUpdate('swap')} className={`${baseStyle} bg-indigo-600 hover:bg-indigo-700`}>SWAP STRIKE</button>
      </div>
    </div>
  );
};

export default ScoreControlPanel;