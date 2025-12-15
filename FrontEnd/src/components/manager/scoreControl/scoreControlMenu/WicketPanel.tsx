import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { SelectInput } from './SharedComponents';
import type { InningsState, Player } from '../../../../features/manager/Matches/matchTypes';

interface WicketPanelProps {
    onClose: () => void;
    forms: {
        dismissalType: string;
        newBatsmanId: string;
        fielderId: string;
    };
    updateForm: (key: 'dismissalType' | 'newBatsmanId' | 'outPlayerId' | 'fielderId', value: string) => void;
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
        <div className="animate-in fade-in zoom-in duration-200 bg-red-950/20 border border-red-900/50 rounded-xl p-5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-red-500 font-bold flex items-center gap-2">
                    <AlertCircle size={18} /> Confirm Wicket
                </h3>
                <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
                <SelectInput
                    label="Dismissal Type"
                    value={forms.dismissalType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('dismissalType', e.target.value)}
                    options={["Caught", "Bowled", "LBW", "Run Out", "Stumped", "Hit Wicket", "Obstructing"].map(v => ({ value: v, label: v }))}
                />

                {/* Who is OUT? */}
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
                    <SelectInput
                        label="Who is out?"
                        value={currentInnings?.currentStriker || ''}
                        onChange={() => { }}
                        options={[{ value: currentInnings?.currentStriker || '', label: getPlayerName(currentInnings?.currentStriker ?? '') }]}
                        placeholder={getPlayerName(currentInnings?.currentStriker ?? '')}
                        disabled={true}
                    />
                )}

                <SelectInput
                    label="New Batsman"
                    value={forms.newBatsmanId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('newBatsmanId', e.target.value)}
                    options={getAvailableBatsmen().map((p: Player) => ({ value: p._id, label: p.name }))}
                />
                {['Caught', 'Run Out', 'Stumped'].includes(forms.dismissalType) && (
                    <SelectInput
                        label="Fielder"
                        value={forms.fielderId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm('fielderId', e.target.value)}
                        options={getFielders().map((p: Player) => ({ value: p._id, label: p.name }))}
                    />
                )}
            </div>
            <div className="flex gap-3 mt-6">
                <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-neutral-900 text-neutral-400 font-bold text-sm hover:bg-neutral-800 transition-colors">
                    Cancel
                </button>
                <button
                    disabled={!forms.newBatsmanId}
                    onClick={actions.handleWicket}
                    className="flex-1 py-3 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Dismiss Batsman
                </button>
            </div>
        </div>
    );
};