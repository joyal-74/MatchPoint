import React, { useState, useMemo, useEffect } from 'react';
import { Undo, Settings, X, Play, RotateCw, AlertCircle, ChevronDown, CircleDot, MoreHorizontal, MinusCircle, PlusCircle, LogOut } from 'lucide-react';
import type { Match, LiveScoreState, Team, InningsState } from '../../../features/manager/Matches/matchTypes';

interface ScoreUpdateControlsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    emitScoreUpdate: (payload: any) => void;
    emitUndoAction?: () => void;
}

type ScoreUpdatePayload =
    | { type: 'RUNS'; matchId: string; runs: number }
    | { type: 'EXTRA'; matchId: string; extraType: string; extraRuns: number }
    | { type: 'WICKET'; matchId: string; dismissalType: string; outBatsmanId: string; nextBatsmanId: string; fielderId?: string | null }
    | { type: 'PENALTY'; matchId: string; runs: number }
    | { type: 'RETIRE'; matchId: string; outBatsmanId: string; newBatsmanId: string; isRetiredHurt: boolean }
    | { type: 'INIT_INNINGS'; matchId: string; oversLimit: number; strikerId: string; nonStrikerId: string; bowlerId: string; battingTeamId: string; bowlingTeamId: string }
    | { type: 'SET_BOWLER'; matchId: string; bowlerId: string }
    | { type: 'SET_STRIKER'; matchId: string; batsmanId: string }
    | { type: 'SET_NON_STRIKER'; matchId: string; batsmanId: string }
    | { type: 'END_OVER'; matchId: string }
    | { type: 'END_INNINGS'; matchId: string }
    | { type: 'UNDO'; matchId: string };

const ScoreUpdateControls: React.FC<ScoreUpdateControlsProps> = ({
    match,
    teamA,
    teamB,
    liveScore,
    emitScoreUpdate,
    emitUndoAction
}) => {
    // --- State ---
    const [newBatsmanId, setNewBatsmanId] = useState<string>('');
    const [dismissalType, setDismissalType] = useState<string>('Caught');
    const [isWicketMode, setIsWicketMode] = useState<boolean>(false);
    const [fielderId, setFielderId] = useState<string>('');

    // Modal states
    const [isInitialSetupModalOpen, setIsInitialSetupModalOpen] = useState<boolean>(false);
    const [isBowlerChangeModalOpen, setIsBowlerChangeModalOpen] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isSpecialModalOpen, setIsSpecialModalOpen] = useState<boolean>(false);
    const [isChangeStrikerModalOpen, setIsChangeStrikerModalOpen] = useState<boolean>(false);
    const [isChangeNonStrikerModalOpen, setIsChangeNonStrikerModalOpen] = useState<boolean>(false);

    // Special Modal States
    const [penaltyRuns, setPenaltyRuns] = useState<number>(5);
    const [retirePlayerId, setRetirePlayerId] = useState<string>('');
    const [retireType, setRetireType] = useState<'hurt' | 'out'>('hurt');
    const [newRetireBatsmanId, setNewRetireBatsmanId] = useState<string>('');

    // Form states
    const [striker, setStriker] = useState<string>('');
    const [nonStriker, setNonStriker] = useState<string>('');
    const [bowler, setBowler] = useState<string>('');
    const [newBowlerId, setNewBowlerId] = useState<string>('');
    const [newStrikerId, setNewStrikerId] = useState<string>('');
    const [newcurrentNonStriker, setNewcurrentNonStriker] = useState<string>('');
    const [isChangingBowler, setIsChangingBowler] = useState(false);


    // --- Data Derivation ---
    if (!liveScore) return <div className="p-8 text-center text-sm text-neutral-500 italic">Initializing console...</div>;
    const currentInnings: InningsState | null = liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    if (!currentInnings) return <div className="p-8 text-center text-sm text-neutral-500 italic">Waiting for innings...</div>;


    const battingTeam = match.teamA._id === currentInnings.battingTeamId ? teamA : teamB;
    const bowlingTeam = match.teamA._id === currentInnings.bowlingTeamId ? teamA : teamB;
    const needsInitialSetup = !currentInnings.currentStriker || !currentInnings.currentNonStriker || !currentInnings.currentBowler;
    const bowlingStats = Array.isArray(currentInnings?.bowlingStats)
        ? currentInnings.bowlingStats
        : [];
    const currentBowlerStat = bowlingStats.find(
        (stat) => String(stat.playerId) === String(currentInnings?.currentBowler)
    );
    const ballsInOver = currentBowlerStat?.balls ?? 0;
    
    const allPlayers = useMemo(() => [...battingTeam.members, ...bowlingTeam.members], [battingTeam, bowlingTeam]);

    const disabled = isChangingBowler;

    console.log(liveScore)

    // Reset form on innings update
    useEffect(() => {
        if (currentInnings.currentStriker) {
            setStriker(currentInnings.currentStriker);
            setNonStriker(currentInnings.currentNonStriker || '');
            setBowler(currentInnings.currentBowler || '');
        }
    }, [currentInnings]);

    // --- Helpers ---
    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return '—';
        const player = allPlayers.find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const getAvailableBatsmen = () => {
        return battingTeam.members.filter(player => {
            const stats = (currentInnings.battingStats || {})[player._id];
            return !stats || !(stats).isOut;
        }).filter(player =>
            player._id !== currentInnings.currentStriker &&
            player._id !== currentInnings.currentNonStriker
        );
    };

    const getFielders = () => bowlingTeam.members.filter(player => player._id !== currentInnings.currentBowler);

    const handleRuns = (runs: number) => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'RUNS',
            runs
        } as ScoreUpdatePayload);
    };

    const handleExtra = (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'EXTRA',
            extraType: type,
            extraRuns: 1
        } as ScoreUpdatePayload);
    };

    const handlePenalty = (runs: number) => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'PENALTY',
            runs: runs
        } as ScoreUpdatePayload);
        setIsSpecialModalOpen(false);
    };

    const handleRetire = () => {
        if (!retirePlayerId || !newRetireBatsmanId) return;
        emitScoreUpdate({
            matchId: match._id,
            type: 'RETIRE',
            outBatsmanId: retirePlayerId,
            newBatsmanId: newRetireBatsmanId,
            isRetiredHurt: retireType === 'hurt'
        } as ScoreUpdatePayload);
        setIsSpecialModalOpen(false);
        setRetirePlayerId('');
        setNewRetireBatsmanId('');
    };

    const handleSetStriker = (batsmanId: string) => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'SET_STRIKER',
            batsmanId
        } as ScoreUpdatePayload);
        setIsChangeStrikerModalOpen(false);
    };

    const handleSetNonStriker = (batsmanId: string) => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'SET_NON_STRIKER',
            batsmanId
        } as ScoreUpdatePayload);
        setIsChangeNonStrikerModalOpen(false);
    };

    const handleEndOver = () => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'END_OVER'
        } as ScoreUpdatePayload);
    };

    const handleUndo = () => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'UNDO'
        } as ScoreUpdatePayload);
        if (emitUndoAction) emitUndoAction();
    };

    const handleEndInnings = () => {
        emitScoreUpdate({
            matchId: match._id,
            type: 'END_INNINGS'
        } as ScoreUpdatePayload);
    };

    const handleBowlerChange = () => {
        if (!newBowlerId) return;

        if (ballsInOver >= 6) {
            handleEndOver();
        }

        setIsChangingBowler(true);

        // Then change bowler
        emitScoreUpdate({
            matchId: match._id,
            type: 'SET_BOWLER',
            bowlerId: newBowlerId
        } as ScoreUpdatePayload);

        setIsBowlerChangeModalOpen(false);
        setIsChangingBowler(false);
    };

    // --- Components ---

    const SelectInput = ({ label, value, onChange, options, placeholder = "Select...", disabled = false }: any) => (
        <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
            </div>
        </div>
    );

    const Modal = ({ isOpen, onClose, title, children, icon: Icon, size = "md" }: any) => {
        if (!isOpen) return null;
        const sizeClasses = {
            sm: "max-w-sm",
            md: "max-w-md",
            lg: "max-w-lg"
        };

        return (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className={`bg-neutral-950 w-full ${sizeClasses[size]} rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden`}>
                    <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                        <div className="flex items-center gap-3">
                            {Icon && <Icon className="h-5 w-5 text-neutral-400" />}
                            <h3 className="font-bold text-white text-lg">{title}</h3>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded-full transition-colors">
                            <X className="h-5 w-5 text-neutral-400" />
                        </button>
                    </div>
                    <div className="p-5">{children}</div>
                </div>
            </div>
        );
    };

    // --- Sub-Modals ---

    const InitialSetupModal = () => {
        const isStartDisabled = !striker || !nonStriker || !bowler || striker === nonStriker;

        const handleStartInnings = () => {
            emitScoreUpdate({
                matchId: match._id,
                type: 'INIT_INNINGS',
                strikerId: striker,
                nonStrikerId: nonStriker,
                bowlerId: bowler,
                battingTeamId: battingTeam._id,
                bowlingTeamId: bowlingTeam._id,
                oversLimit: match.overs || 20
            } as ScoreUpdatePayload);
            setIsInitialSetupModalOpen(false);
        };

        return (
            <Modal isOpen={isInitialSetupModalOpen} onClose={() => setIsInitialSetupModalOpen(false)} title="Start Innings" icon={Play}>
                <SelectInput
                    label="Striker"
                    value={striker}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStriker(e.target.value)}
                    options={battingTeam.members.map(p => ({ value: p._id, label: p.name }))}
                />
                <SelectInput
                    label="Non-Striker"
                    value={nonStriker}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNonStriker(e.target.value)}
                    options={battingTeam.members.map(p => ({ value: p._id, label: p.name }))}
                />
                <div className="h-px bg-neutral-800 my-4" />
                <SelectInput
                    label="Opening Bowler"
                    value={bowler}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBowler(e.target.value)}
                    options={bowlingTeam.members.map(p => ({ value: p._id, label: p.name }))}
                />
                <button
                    onClick={handleStartInnings}
                    disabled={isStartDisabled}
                    className={`w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all ${isStartDisabled
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                >
                    Start Match
                </button>
            </Modal>
        );
    };

    const BowlerChangeModal = () => (
        <Modal isOpen={isBowlerChangeModalOpen} onClose={() => setIsBowlerChangeModalOpen(false)} title="Change Bowler" icon={RotateCw}>
            <div className="bg-neutral-900 rounded-lg p-3 mb-4 border border-neutral-800 flex justify-between items-center">
                <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Current Over</div>
                <div className="font-mono font-bold text-white">{Math.floor(ballsInOver / 6)}.{ballsInOver % 6}</div>
            </div>
            <SelectInput
                label="New Bowler"
                value={newBowlerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewBowlerId(e.target.value)}
                options={bowlingTeam.members.filter(p => p._id !== currentInnings.currentBowler).map(p => ({ value: p._id, label: p.name }))}
            />
            <button
                onClick={handleBowlerChange}
                disabled={!newBowlerId}
                className={`w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all ${!newBowlerId
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-neutral-200'
                    }`}
            >
                {ballsInOver >= 6 ? 'End Over & Change Bowler' : 'Change Bowler'}
            </button>
        </Modal>
    );

    const ChangeStrikerModal = () => {
        const availableBatsmen = battingTeam.members.filter(p =>
            p._id !== currentInnings.currentNonStriker &&
            p._id !== currentInnings.currentStriker
        );

        return (
            <Modal isOpen={isChangeStrikerModalOpen} onClose={() => setIsChangeStrikerModalOpen(false)} title="Change Striker" icon={Settings} size="sm">
                <SelectInput
                    label="New Striker"
                    value={newStrikerId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStrikerId(e.target.value)}
                    options={[
                        { value: currentInnings.currentNonStriker, label: `${getPlayerName(currentInnings.currentNonStriker)} (Current Non-Striker)` },
                        ...availableBatsmen.map(p => ({ value: p._id, label: p.name }))
                    ]}
                />
                <button
                    onClick={() => handleSetStriker(newStrikerId)}
                    disabled={!newStrikerId}
                    className={`w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all ${!newStrikerId
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                >
                    Change Striker
                </button>
            </Modal>
        );
    };

    const ChangeNonStrikerModal = () => {
        const availableBatsmen = battingTeam.members.filter(p =>
            p._id !== currentInnings.currentStriker &&
            p._id !== currentInnings.currentNonStriker
        );

        return (
            <Modal isOpen={isChangeNonStrikerModalOpen} onClose={() => setIsChangeNonStrikerModalOpen(false)} title="Change Non-Striker" icon={Settings} size="sm">
                <SelectInput
                    label="New Non-Striker"
                    value={newcurrentNonStriker}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewcurrentNonStriker(e.target.value)}
                    options={[
                        { value: currentInnings.currentStriker, label: `${getPlayerName(currentInnings.currentStriker)} (Current Striker)` },
                        ...availableBatsmen.map(p => ({ value: p._id, label: p.name }))
                    ]}
                />
                <button
                    onClick={() => handleSetNonStriker(newcurrentNonStriker)}
                    disabled={!newcurrentNonStriker}
                    className={`w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all ${!newcurrentNonStriker
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                >
                    Change Non-Striker
                </button>
            </Modal>
        );
    };

    const SpecialModal = () => (
        <Modal isOpen={isSpecialModalOpen} onClose={() => setIsSpecialModalOpen(false)} title="Special Events" icon={MoreHorizontal}>
            <div className="space-y-6">
                {/* Penalty Runs Section */}
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <AlertCircle size={14} className="text-yellow-500" /> Penalty Runs
                    </h4>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPenaltyRuns(prev => Math.max(0, prev - 1))}
                            className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={penaltyRuns <= 0}
                        >
                            <MinusCircle size={18} />
                        </button>
                        <div className="flex-1 text-center font-mono font-bold text-xl text-white">{penaltyRuns > 0 ? `+${penaltyRuns}` : penaltyRuns}</div>
                        <button onClick={() => setPenaltyRuns(prev => prev + 1)} className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-neutral-300">
                            <PlusCircle size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => handlePenalty(penaltyRuns)}
                        disabled={penaltyRuns <= 0}
                        className="w-full mt-3 py-2 bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Apply Penalty
                    </button>
                </div>

                {/* Retire Section */}
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <LogOut size={14} className="text-red-400" /> Retire Batsman
                    </h4>
                    <SelectInput
                        label="Batsman to Retire"
                        value={retirePlayerId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRetirePlayerId(e.target.value)}
                        options={[
                            { value: currentInnings.currentStriker, label: `${getPlayerName(currentInnings.currentStriker)} (Striker)` },
                            { value: currentInnings.currentNonStriker, label: `${getPlayerName(currentInnings.currentNonStriker)} (Non-Striker)` }
                        ]}
                    />
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                            onClick={() => setRetireType('hurt')}
                            className={`py-2 rounded-lg text-xs font-bold border transition-colors ${retireType === 'hurt' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-400'}`}
                        >
                            Retired Hurt
                        </button>
                        <button
                            onClick={() => setRetireType('out')}
                            className={`py-2 rounded-lg text-xs font-bold border transition-colors ${retireType === 'out' ? 'bg-red-600 border-red-600 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-400'}`}
                        >
                            Retired Out
                        </button>
                    </div>
                    <SelectInput
                        label="New Batsman"
                        value={newRetireBatsmanId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRetireBatsmanId(e.target.value)}
                        options={getAvailableBatsmen().map(p => ({ value: p._id, label: p.name }))}
                    />
                    <button
                        disabled={!retirePlayerId || !newRetireBatsmanId}
                        onClick={handleRetire}
                        className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirm Retirement
                    </button>
                </div>
            </div>
        </Modal>
    );

    // --- Main UI ---

    return (
        <div className="w-full max-w-2xl mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden select-none">
            {/* 1. Header Control Bar */}
            <div className="bg-neutral-900/50 px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Scoring Console</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={`p-2 rounded-lg transition-all ${isSettingsOpen ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                        >
                            <Settings size={16} />
                        </button>
                        {/* Settings Dropdown */}
                        {isSettingsOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSettingsOpen(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-20 py-1">
                                    <button
                                        onClick={() => { setIsChangeStrikerModalOpen(true); setIsSettingsOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                                    >
                                        Change Striker
                                    </button>
                                    <button
                                        onClick={() => { setIsChangeNonStrikerModalOpen(true); setIsSettingsOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                                    >
                                        Change Non-Striker
                                    </button>
                                    <button
                                        onClick={() => { setIsBowlerChangeModalOpen(true); setIsSettingsOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                                    >
                                        Change Bowler
                                    </button>
                                    <div className="h-px bg-neutral-800 my-1"></div>
                                    <button
                                        onClick={() => { setIsInitialSetupModalOpen(true); setIsSettingsOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                                    >
                                        Edit Opening Setup
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Main Interaction Area */}
            <div className="p-6">
                {needsInitialSetup ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800">
                            <Play className="text-neutral-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Ready to Start?</h3>
                        <p className="text-neutral-500 text-sm mb-6">Set up the opening batsmen and bowler.</p>
                        <button
                            onClick={() => setIsInitialSetupModalOpen(true)}
                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors"
                        >
                            Setup Innings
                        </button>
                    </div>
                ) : isWicketMode ? (
                    <div className="animate-in fade-in zoom-in duration-200 bg-red-950/20 border border-red-900/50 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-red-500 font-bold flex items-center gap-2">
                                <AlertCircle size={18} /> Confirm Wicket
                            </h3>
                            <button onClick={() => setIsWicketMode(false)} className="text-neutral-500 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="space-y-4">
                            <SelectInput
                                label="Dismissal Type"
                                value={dismissalType}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDismissalType(e.target.value)}
                                options={["Caught", "Bowled", "LBW", "Run Out", "Stumped", "Hit Wicket", "Obstructing"].map(v => ({ value: v, label: v }))}
                            />

                            <SelectInput
                                label="Who is out?"
                                value={currentInnings.currentStriker || ''}
                                onChange={() => { }}
                                options={[{ value: currentInnings.currentStriker || '', label: getPlayerName(currentInnings.currentStriker) }]}
                                placeholder={getPlayerName(currentInnings.currentStriker)}
                                disabled={true}
                            />

                            <SelectInput
                                label="New Batsman"
                                value={newBatsmanId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewBatsmanId(e.target.value)}
                                options={getAvailableBatsmen().map(p => ({ value: p._id, label: p.name }))}
                            />

                            {['Caught', 'Run Out', 'Stumped'].includes(dismissalType) && (
                                <SelectInput
                                    label="Fielder"
                                    value={fielderId}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFielderId(e.target.value)}
                                    options={getFielders().map(p => ({ value: p._id, label: p.name }))}
                                />
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsWicketMode(false)}
                                className="flex-1 py-3 rounded-lg bg-neutral-900 text-neutral-400 font-bold text-sm hover:bg-neutral-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!newBatsmanId}
                                onClick={() => {
                                    emitScoreUpdate({
                                        matchId: match._id,
                                        type: "WICKET",
                                        dismissalType,
                                        outBatsmanId: currentInnings.currentStriker || '',
                                        nextBatsmanId: newBatsmanId,
                                        fielderId: fielderId || null,
                                    } as ScoreUpdatePayload);
                                    setIsWicketMode(false);
                                    setNewBatsmanId('');
                                    setFielderId('');
                                }}
                                className="flex-1 py-3 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Dismiss Batsman
                            </button>
                        </div>
                    </div>
                ) : (
                    // Standard Controls
                    <div className="space-y-6">
                        {/* Runs Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {[0, 1, 2, 3].map(runs => (
                                <button
                                    disabled={disabled}
                                    key={runs}
                                    onClick={() => handleRuns(runs)}
                                    className={`
                                    h-14 rounded-xl font-bold text-xl transition-all active:scale-95 border
                                    ${runs === 0
                                            ? 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-300'
                                            : 'bg-neutral-900 text-white border-neutral-800 hover:bg-neutral-800'
                                        }
                                `}
                                >
                                    {runs === 0 ? <span className="text-2xl">•</span> : runs}
                                </button>
                            ))}
                            <button disabled={disabled} onClick={() => handleRuns(4)} className="h-14 rounded-xl font-bold text-xl transition-all active:scale-95 bg-blue-900/20 text-blue-500 border border-blue-900/50 hover:bg-blue-900/30">4</button>
                            <button disabled={disabled} onClick={() => handleRuns(6)} className="h-14 rounded-xl font-bold text-xl transition-all active:scale-95 bg-purple-900/20 text-purple-500 border border-purple-900/50 hover:bg-purple-900/30">6</button>
                            <button
                                onClick={() => setIsWicketMode(true)}
                                className="col-span-2 h-14 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/30 flex items-center justify-center gap-2"
                            >
                                <CircleDot size={16} /> Wicket
                            </button>
                        </div>

                        {/* Extras Row */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-600 mb-2">Extras</label>
                            <div className="grid grid-cols-4 gap-2">
                                <button disabled={disabled} onClick={() => handleExtra('wide')} className="py-2 rounded-lg text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white hover:border-neutral-600 transition-all">WD</button>
                                <button disabled={disabled} onClick={() => handleExtra('noBall')} className="py-2 rounded-lg text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white hover:border-neutral-600 transition-all">NB</button>
                                <button disabled={disabled} onClick={() => handleExtra('bye')} className="py-2 rounded-lg text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white hover:border-neutral-600 transition-all">B</button>
                                <button disabled={disabled} onClick={() => handleExtra('legBye')} className="py-2 rounded-lg text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white hover:border-neutral-600 transition-all">LB</button>
                            </div>
                        </div>

                        {/* Game State Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/50">
                            <button
                                onClick={handleUndo}
                                className="h-12 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm"
                            >
                                <Undo size={16} /> Undo
                            </button>

                            <button
                                disabled={disabled}
                                onClick={() => setIsSpecialModalOpen(true)}
                                className="h-12 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm"
                            >
                                <MoreHorizontal size={16} /> Special
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                if (ballsInOver >= 6) {
                                    handleBowlerChange()
                                    setIsBowlerChangeModalOpen(true);
                                } else if (window.confirm('End over early?')) {
                                    handleBowlerChange()
                                    setIsBowlerChangeModalOpen(true);
                                }
                            }}
                            className={`
                                w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                                ${ballsInOver >= 6
                                    ? 'bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10'
                                    : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                                }
                            `}
                        >
                            {ballsInOver >= 6 ? <><RotateCw size={16} /> End Over & Switch</> : 'End Over Early'}
                        </button>

                        {((currentInnings.wickets >= 10) || (currentInnings.overs >= (match.overs || 50) && ballsInOver >= 6)) && (
                            <button
                                onClick={handleEndInnings}
                                className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-900/20"
                            >
                                Finish Innings
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modals Rendered Here */}
            {isInitialSetupModalOpen && <InitialSetupModal />}
            {isBowlerChangeModalOpen && <BowlerChangeModal />}
            {isChangeStrikerModalOpen && <ChangeStrikerModal />}
            {isChangeNonStrikerModalOpen && <ChangeNonStrikerModal />}
            {isSpecialModalOpen && <SpecialModal />}
        </div>
    );
};

export default ScoreUpdateControls;