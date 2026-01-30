import { useState, useMemo, useEffect } from 'react';
import type { Match, Team } from '../../../../domain/match/types';
import type { InningsState, LiveScoreState } from '../../../../features/manager/Matches/matchTypes';

export type ScoreUpdatePayload =
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

interface UseScoreControlsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    emitScoreUpdate: (payload: ScoreUpdatePayload) => void;
    emitUndoAction?: () => void;
}

export const useScoreControls = ({ match, teamA, teamB, liveScore, emitScoreUpdate, emitUndoAction }: UseScoreControlsProps) => {
    // --- UI State ---
    const [modals, setModals] = useState({
        initialSetup: false,
        bowlerChange: false,
        settings: false,
        special: false,
        changeStriker: false,
        changeNonStriker: false,
    });
    const [isWicketMode, setIsWicketMode] = useState(false);
    const [isChangingBowler, setIsChangingBowler] = useState(false);

    // --- Form State ---
    const [forms, setForms] = useState({
        striker: '',
        nonStriker: '',
        bowler: '',
        newBatsmanId: '',
        newBowlerId: '',
        newStrikerId: '',
        newNonStrikerId: '',
        dismissalType: 'Caught',
        fielderId: '',
        penaltyRuns: 5,
        retirePlayerId: '',
        outPlayerId: '',
        retireType: 'hurt' as 'hurt' | 'out',
        newRetireBatsmanId: ''
    });

    // --- Derived Data ---
    const currentInnings: InningsState | null = liveScore
        ? (liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2)
        : null;


    const battingTeam = currentInnings?.battingTeam === teamA._id ? teamA : teamB;
    const bowlingTeam = currentInnings?.bowlingTeam === teamA._id ? teamA : teamB;


    const needsInitialSetup = !currentInnings?.currentStriker || !currentInnings?.currentNonStriker || !currentInnings?.currentBowler;

    const ballsInOver = useMemo(() => {
        if (!currentInnings) return 0;
        const bowlingStats = Array.isArray(currentInnings.bowlingStats) ? currentInnings.bowlingStats : [];
        const currentBowlerStat = bowlingStats.find(stat => String(stat.playerId) === String(currentInnings?.currentBowler));
        return currentBowlerStat?.balls ?? 0;
    }, [currentInnings?.bowlingStats, currentInnings?.currentBowler]);


    const allPlayers = useMemo(() => [...battingTeam.members, ...bowlingTeam.members], [battingTeam, bowlingTeam]);

    // Reset setup form on innings update
    useEffect(() => {
        if (currentInnings?.currentStriker) {
            updateForm('striker', currentInnings.currentStriker);
            updateForm('nonStriker', currentInnings.currentNonStriker || '');
            updateForm('bowler', currentInnings.currentBowler || '');
        }
    }, [currentInnings?.currentStriker, currentInnings?.currentNonStriker, currentInnings?.currentBowler]);

    // --- Helpers ---
    const updateForm = (key: keyof typeof forms, value: string | number | boolean) => {
        setForms(prev => ({ ...prev, [key]: value }));
    };

    const toggleModal = (key: keyof typeof modals, value: boolean) => {
        setModals(prev => ({ ...prev, [key]: value }));
    };

    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return '—';
        const player = allPlayers.find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const getAvailableBatsmen = () => {
        return battingTeam.members.filter(player => {
            const stats = currentInnings?.battingStats.find(
                s => s.playerId === player._id
            );
            return !stats || !stats.out;
        }).filter(player =>
            player._id !== currentInnings?.currentStriker &&
            player._id !== currentInnings?.currentNonStriker
        );
    };

    const getAvailableBowlers = () => {
        return bowlingTeam.members.filter(player => player._id !== currentInnings?.currentBowler);
    };

    const getFielders = () => bowlingTeam.members.filter(player => player._id !== currentInnings?.currentBowler);

    // --- Actions ---
    const actions = {
        handleRuns: (runs: number) => {
            emitScoreUpdate({ matchId: match._id, type: 'RUNS', runs });
        },
        handleExtra: (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
            emitScoreUpdate({ matchId: match._id, type: 'EXTRA', extraType: type, extraRuns: 1 });
        },
        handlePenalty: () => {
            emitScoreUpdate({ matchId: match._id, type: 'PENALTY', runs: forms.penaltyRuns });
            toggleModal('special', false);
        },
        handleRetire: () => {
            if (!forms.retirePlayerId || !forms.newRetireBatsmanId) return;
            emitScoreUpdate({
                matchId: match._id,
                type: 'RETIRE',
                outBatsmanId: forms.retirePlayerId,
                newBatsmanId: forms.newRetireBatsmanId,
                isRetiredHurt: forms.retireType === 'hurt'
            });
            toggleModal('special', false);
            updateForm('retirePlayerId', '');
            updateForm('newRetireBatsmanId', '');
        },
        handleWicket: () => {
            emitScoreUpdate({
                matchId: match._id,
                type: "WICKET",
                dismissalType: forms.dismissalType,
                outBatsmanId: currentInnings?.currentStriker || '',
                nextBatsmanId: forms.newBatsmanId,
                fielderId: forms.fielderId || null,
            });
            setIsWicketMode(false);
            updateForm('newBatsmanId', '');
            updateForm('fielderId', '');
        },
        handleSetStriker: () => {
            emitScoreUpdate({ matchId: match._id, type: 'SET_STRIKER', batsmanId: forms.newStrikerId });
            toggleModal('changeStriker', false);
        },
        handleSetNonStriker: () => {
            emitScoreUpdate({ matchId: match._id, type: 'SET_NON_STRIKER', batsmanId: forms.newNonStrikerId });
            toggleModal('changeNonStriker', false);
        },
        handleStartInnings: () => {
            emitScoreUpdate({
                matchId: match._id,
                type: 'INIT_INNINGS',
                strikerId: forms.striker,
                nonStrikerId: forms.nonStriker,
                bowlerId: forms.bowler,
                battingTeamId: battingTeam._id,
                bowlingTeamId: bowlingTeam._id,
                oversLimit: match.overs || 20
            });
            toggleModal('initialSetup', false);
        },
        handleBowlerChange: () => {
            // if (!forms.newBowlerId) return;
            if (ballsInOver >= 6) {
                emitScoreUpdate({ matchId: match._id, type: 'END_OVER' });
            }
            setIsChangingBowler(true);
            emitScoreUpdate({ matchId: match._id, type: 'SET_BOWLER', bowlerId: forms.newBowlerId });
            toggleModal('bowlerChange', false);
            setIsChangingBowler(false);
        },
        handleEndOver: () => emitScoreUpdate({ matchId: match._id, type: 'END_OVER' }),
        handleUndo: () => {
            emitScoreUpdate({ matchId: match._id, type: 'UNDO' });
            if (emitUndoAction) emitUndoAction();
        },
        handleEndInnings: () => emitScoreUpdate({ matchId: match._id, type: 'END_INNINGS' }),
    };

    return {
        match,
        currentInnings,
        battingTeam,
        bowlingTeam,
        ballsInOver,
        needsInitialSetup,
        disabled: isChangingBowler,

        forms,
        modals,
        isWicketMode,

        setIsWicketMode,
        updateForm,
        toggleModal,

        getPlayerName,
        getAvailableBatsmen,
        getAvailableBowlers,
        getFielders,

        actions
    };
};