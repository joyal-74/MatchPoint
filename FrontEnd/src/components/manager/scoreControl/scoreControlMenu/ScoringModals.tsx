import { Play, RotateCw, Settings, MoreHorizontal, AlertCircle, MinusCircle, PlusCircle, LogOut } from 'lucide-react';
import { Modal, SelectInput } from './SharedComponents';
import type { InningsState } from '../../../../features/manager/Matches/matchTypes';
import type { Player } from '../../../../domain/match/types';

type FormsState = {
    striker: string;
    nonStriker: string;
    bowler: string;
    newBatsmanId: string;
    newBowlerId: string;
    newStrikerId: string;
    newNonStrikerId: string;
    dismissalType: string;
    fielderId: string;
    penaltyRuns: number;
    retirePlayerId: string;
    retireType: 'hurt' | 'out';
    newRetireBatsmanId: string;
};

export type UpdateForm = (key: keyof FormsState, value: string | number | boolean) => void;

type Actions = {
    handleStartInnings: () => void;
    handleBowlerChange: () => void;
    handleSetStriker: () => void;
    handleSetNonStriker: () => void;
    handlePenalty: () => void;
    handleRetire: () => void;
};

interface InitialSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    forms: FormsState;
    updateForm: UpdateForm;
    actions: Actions;
    battingTeam: { members: Player[] };
    bowlingTeam: { members: Player[] };
}

export const InitialSetupModal = ({ isOpen, onClose, forms, updateForm, actions, battingTeam, bowlingTeam }: InitialSetupModalProps) => {
    const isStartDisabled = !forms.striker || !forms.nonStriker || !forms.bowler || forms.striker === forms.nonStriker;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Start Innings" icon={Play}>
            <SelectInput
                label="Striker"
                value={forms.striker}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('striker', e.target.value)}
                options={battingTeam.members.map((p: Player) => ({ value: p._id, label: p.name }))}
            />
            <SelectInput
                label="Non-Striker"
                value={forms.nonStriker}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('nonStriker', e.target.value)}
                options={battingTeam.members.map((p: Player) => ({ value: p._id, label: p.name }))}
            />
            <div className="h-px bg-border my-4" />
            <SelectInput
                label="Opening Bowler"
                value={forms.bowler}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('bowler', e.target.value)}
                options={bowlingTeam.members.map((p: Player) => ({ value: p._id, label: p.name }))}
            />
            <button
                onClick={actions.handleStartInnings}
                disabled={isStartDisabled}
                className={`w-full py-3 mt-4 rounded-xl font-bold text-sm transition-all ${isStartDisabled ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20'}`}
            >
                Start Match
            </button>
        </Modal>
    );
};

interface BowlerChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    forms: FormsState;
    updateForm: UpdateForm;
    actions: Actions;
    bowlingTeam: { members: Player[] };
    currentInnings?: InningsState | null;
    ballsInOver: number;
}

export const BowlerChangeModal = ({ isOpen, onClose, forms, updateForm, actions, bowlingTeam, currentInnings, ballsInOver }: BowlerChangeModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Bowler" icon={RotateCw}>
            <div className="bg-muted/30 rounded-lg p-3 mb-4 border border-border flex justify-between items-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Over Progress</div>
                <div className="font-mono font-bold text-foreground">{Math.floor(ballsInOver / 6)}.{ballsInOver % 6}</div>
            </div>
            <SelectInput
                label="New Bowler"
                value={forms.newBowlerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('newBowlerId', e.target.value)}
                options={bowlingTeam.members.filter((p: Player) => p._id !== currentInnings?.currentBowler).map((p: Player) => ({ value: p._id, label: p.name }))}
            />
            <button
                onClick={actions.handleBowlerChange}
                disabled={!forms.newBowlerId}
                className={`w-full py-3 mt-4 rounded-xl font-bold text-sm transition-all ${!forms.newBowlerId ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20'}`}
            >
                {ballsInOver >= 6 ? 'End Over & Change Bowler' : 'Change Bowler'}
            </button>
        </Modal>
    )
};

interface ChangeStrikerModalProps {
    isOpen: boolean;
    onClose: () => void;
    forms: FormsState;
    updateForm: UpdateForm;
    actions: Actions;
    battingTeam: { members: Player[] };
    currentInnings: InningsState | null;
    getPlayerName: (id: string | null) => string;
}

export const ChangeStrikerModal = ({ isOpen, onClose, forms, updateForm, actions, battingTeam, currentInnings, getPlayerName }: ChangeStrikerModalProps) => {
    const availableBatsmen = battingTeam.members.filter((p: Player) => p._id !== currentInnings?.currentNonStriker && p._id !== currentInnings?.currentStriker);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Striker" icon={Settings} size="sm">
            <SelectInput
                label="New Striker"
                value={forms.newStrikerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('newStrikerId', e.target.value)}
                options={[
                    { value: currentInnings?.currentNonStriker ?? "", label: `${getPlayerName(currentInnings?.currentNonStriker ?? '')} (Current Non-Striker)` },
                    ...availableBatsmen.map((p: Player) => ({ value: p._id, label: p.name }))
                ]}
            />
            <button
                onClick={actions.handleSetStriker}
                disabled={!forms.newStrikerId}
                className={`w-full py-3 mt-4 rounded-xl font-bold text-sm transition-all ${!forms.newStrikerId ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
            >
                Change Striker
            </button>
        </Modal>
    );
};


type ChangeNonStrikerModalProps = ChangeStrikerModalProps;


export const ChangeNonStrikerModal = ({ isOpen, onClose, forms, updateForm, actions, battingTeam, currentInnings, getPlayerName }: ChangeNonStrikerModalProps) => {
    const availableBatsmen = battingTeam.members.filter((p: Player) => p._id !== currentInnings?.currentStriker && p._id !== currentInnings?.currentNonStriker);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Non-Striker" icon={Settings} size="sm">
            <SelectInput
                label="New Non-Striker"
                value={forms.newNonStrikerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('newNonStrikerId', e.target.value)}
                options={[
                    { value: currentInnings?.currentStriker ?? "", label: `${getPlayerName(currentInnings?.currentStriker ?? '')} (Current Striker)` },
                    ...availableBatsmen.map((p: Player) => ({ value: p._id, label: p.name }))
                ]}

            />
            <button
                onClick={actions.handleSetNonStriker}
                disabled={!forms.newNonStrikerId}
                className={`w-full py-3 mt-4 rounded-xl font-bold text-sm transition-all ${!forms.newNonStrikerId ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
            >
                Change Non-Striker
            </button>
        </Modal>
    );
};

interface SpecialModalProps {
    isOpen: boolean;
    onClose: () => void;
    forms: FormsState;
    updateForm: UpdateForm;
    actions: Actions;
    currentInnings?: InningsState | null;
    getPlayerName: (id: string | null) => string;
    getAvailableBatsmen: () => Player[];
}

export const SpecialModal = ({ isOpen, onClose, forms, updateForm, actions, currentInnings, getPlayerName, getAvailableBatsmen }: SpecialModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Special Events" icon={MoreHorizontal}>
        <div className="space-y-6">
            {/* Penalty Runs */}
            <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                <h4 className="text-sm font-bold text-card-foreground mb-3 flex items-center gap-2">
                    <AlertCircle size={14} className="text-yellow-500" /> Penalty Runs
                </h4>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => updateForm('penaltyRuns', Math.max(0, forms.penaltyRuns - 1))}
                        className="p-2 bg-muted rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                        disabled={forms.penaltyRuns <= 0}
                    >
                        <MinusCircle size={18} />
                    </button>
                    <div className="flex-1 text-center font-mono font-bold text-xl text-foreground">
                        {forms.penaltyRuns > 0 ? `+${forms.penaltyRuns}` : forms.penaltyRuns}
                    </div>
                    <button onClick={() => updateForm('penaltyRuns', forms.penaltyRuns + 1)} className="p-2 bg-muted rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                        <PlusCircle size={18} />
                    </button>
                </div>
                <button
                    onClick={actions.handlePenalty}
                    disabled={forms.penaltyRuns <= 0}
                    className="w-full mt-3 py-2 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Apply Penalty
                </button>
            </div>
            
            {/* Retire */}
            <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                <h4 className="text-sm font-bold text-card-foreground mb-3 flex items-center gap-2">
                    <LogOut size={14} className="text-destructive" /> Retire Batsman
                </h4>
                <SelectInput
                    label="Batsman to Retire"
                    value={forms.retirePlayerId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('retirePlayerId', e.target.value)}
                    options={[
                        { value: currentInnings?.currentStriker ?? "", label: `${getPlayerName(currentInnings?.currentStriker ?? '')} (Striker)` },
                        { value: currentInnings?.currentNonStriker ?? "", label: `${getPlayerName(currentInnings?.currentNonStriker ?? '')} (Non-Striker)` }
                    ]}
                />
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <button onClick={() => updateForm('retireType', 'hurt')} className={`py-2 rounded-lg text-xs font-bold border transition-colors ${forms.retireType === 'hurt' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-muted border-border text-muted-foreground'}`}>Retired Hurt</button>
                    <button onClick={() => updateForm('retireType', 'out')} className={`py-2 rounded-lg text-xs font-bold border transition-colors ${forms.retireType === 'out' ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-muted border-border text-muted-foreground'}`}>Retired Out</button>
                </div>
                <SelectInput
                    label="New Batsman"
                    value={forms.newRetireBatsmanId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('newRetireBatsmanId', e.target.value)}
                    options={getAvailableBatsmen().map((p: Player) => ({ value: p._id, label: p.name }))}
                />
                <button
                    disabled={!forms.retirePlayerId || !forms.newRetireBatsmanId}
                    onClick={actions.handleRetire}
                    className="w-full py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    Confirm Retirement
                </button>
            </div>
        </div>
    </Modal>
);