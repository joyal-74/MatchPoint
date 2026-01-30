import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { SelectInput } from './SharedComponents';
import type { InningsState } from '../../../../features/manager/Matches/matchTypes';
import type { Player } from '../../../../domain/match/types';

export type MatchFormKey =
    | "dismissalType"
    | "striker"
    | "nonStriker"
    | "bowler"
    | "newBatsmanId"
    | "newBowlerId"
    | "newStrikerId"
    | "newNonStrikerId"
    | "fielderId"
    | "outPlayerId"
    | "penaltyRuns"
    | "retirePlayerId"
    | "newRetireBatsmanId"
    | "retireType";


export interface WicketPanelProps {
    onClose: () => void;
    forms: {
        dismissalType: string;
        newBatsmanId: string;
        fielderId: string;
    };
    updateForm: (
        key: "dismissalType" | "newBatsmanId" | "fielderId" | "outPlayerId",
        value: string
    ) => void;

    actions: {
        handleWicket: () => void;
    };
    currentInnings: InningsState | null;
    getPlayerName: (id: string | null) => string;
    getAvailableBatsmen: () => Player[];
    getFielders: () => Player[];
}

export const WicketPanel = ({ onClose, forms, updateForm, actions, currentInnings, getPlayerName, getAvailableBatsmen, getFielders }: WicketPanelProps) => {
    const dismissalsWithChoice = ["Run Out", "Obstructing"];

    return (
        <div className="animate-in fade-in zoom-in duration-200 bg-destructive/5 border border-destructive/20 rounded-xl p-5 shadow-inner">

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-destructive/10 pb-4">
                <h3 className="text-destructive font-bold flex items-center gap-2 text-lg">
                    <AlertCircle size={20} /> Confirm Wicket
                </h3>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground p-1 hover:bg-destructive/10 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                <SelectInput
                    label="Dismissal Type"
                    value={forms.dismissalType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('dismissalType', e.target.value)}
                    options={["Caught", "Bowled", "LBW", "Run Out", "Stumped", "Hit Wicket", "Obstructing"].map(v => ({ value: v, label: v }))}
                />

                {/* Who is OUT logic */}
                {dismissalsWithChoice.includes(forms.dismissalType) ? (
                    <SelectInput
                        label="Who is out?"
                        value={currentInnings?.currentStriker || ''}
                        onChange={(e) => updateForm("outPlayerId", e.target.value)}
                        options={[
                            { value: currentInnings?.currentStriker ?? '', label: getPlayerName(currentInnings?.currentStriker ?? '') + " (Striker)" },
                            { value: currentInnings?.currentNonStriker ?? '', label: getPlayerName(currentInnings?.currentNonStriker ?? '') + " (Non-Striker)" }
                        ]}
                        placeholder="Select Out Player"
                    />
                ) : (
                    <div className="opacity-70 pointer-events-none">
                        <SelectInput
                            label="Who is out?"
                            value={currentInnings?.currentStriker || ''}
                            onChange={() => { }}
                            options={[{ value: currentInnings?.currentStriker || '', label: getPlayerName(currentInnings?.currentStriker ?? '') + " (Striker)" }]}
                            placeholder={getPlayerName(currentInnings?.currentStriker ?? '')}
                            disabled={true}
                        />
                    </div>
                )}

                <SelectInput
                    label="New Batsman"
                    value={forms.newBatsmanId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('newBatsmanId', e.target.value)}
                    options={getAvailableBatsmen().map((p: Player) => ({ value: p._id, label: p.name }))}
                />

                {['Caught', 'Run Out', 'Stumped'].includes(forms.dismissalType) && (
                    <SelectInput
                        label="Fielder Involved"
                        value={forms.fielderId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('fielderId', e.target.value)}
                        options={getFielders().map((p: Player) => ({ value: p._id, label: p.name }))}
                    />
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 hover:text-foreground transition-colors"
                >
                    Cancel
                </button>
                <button
                    disabled={!forms.newBatsmanId}
                    onClick={actions.handleWicket}
                    className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-destructive/20"
                >
                    Dismiss Batsman
                </button>
            </div>
        </div>
    );
};