import { useState, useMemo, useEffect } from 'react';
import type { TeamPlayer } from '../../../types/Player';
import { X, Search, Users, Loader2 } from 'lucide-react';


interface PlayerSelectionModalProps {
    availablePlayers: TeamPlayer[] | undefined;
    onClose: () => void;
    onAddPlayer: (playerId: string) => void;
}

const PlayerCard = ({ player, onSelect }: { player: TeamPlayer; onSelect: (id: string) => void }) => {
    const initials = player.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);

    return (
        <div
            key={player._id}
            className="group flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg p-3 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            onClick={() => onSelect(player._id)}
        >
            <div className="flex items-center gap-3">
                {/* Initial Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600/50 border border-emerald-500 flex items-center justify-center text-white font-semibold text-base shadow-md">
                    {initials}
                </div>
                <div>
                    {/* Player Name */}
                    <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors text-sm truncate">
                        {player.name}
                    </h3>
                    {/* Player Role */}
                    <span className="inline-block px-2 py-0.5 bg-neutral-900 text-emerald-400 text-xs font-medium rounded-full mt-0.5">
                        {player.role}
                    </span>
                </div>
            </div>

            {/* Add Icon Button */}
            <button
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-emerald-400 hover:text-emerald-300 rounded-full hover:bg-neutral-600"
                aria-label={`Select ${player.name}`}
            >
                <PlusIcon className="w-5 h-5" /> {/* Using PlusIcon for a minimal add visual */}
            </button>
        </div>
    );
};

const PlusIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);


export default function PlayerSelectionModal({
    availablePlayers,
    onClose,
    onAddPlayer,
}: PlayerSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('All');

    // Extract unique roles from players
    const roles = useMemo(() => {
        if (!availablePlayers) return ['All'];
        const uniqueRoles = [...new Set(availablePlayers.map(p => p.role))];
        return ['All', ...uniqueRoles].sort(); // Sort roles alphabetically
    }, [availablePlayers]);

    // Filter players based on search and role
    const filteredPlayers = useMemo(() => {
        if (!availablePlayers) return [];

        return availablePlayers.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'All' || player.role === selectedRole;
            return matchesSearch && matchesRole;
        });
    }, [availablePlayers, searchTerm, selectedRole]);

    // Focus search input on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            // Use a ref for better React practice, but keeping document.querySelector for minimal change
            const searchInput = document.querySelector<HTMLInputElement>('input[placeholder="Search players..."]');
            searchInput?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSelectPlayer = (playerId: string) => {
        onAddPlayer(playerId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Reduced max-w for smaller, tighter modal */}
            <div className="relative bg-neutral-900 rounded-xl shadow-2xl w-full max-w-xl mx-auto border border-neutral-800 transition-transform duration-300 ease-out scale-95 opacity-100">
                
                {/* Modal Header */}
                <div className="p-5 border-b border-neutral-800 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-400" /> Select Player
                        </h2>
                        <p className="text-neutral-400 text-sm mt-1">Search and filter available players to add.</p>
                    </div>
                    
                    {/* Close Button - more minimal style */}
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-neutral-800"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search and Filters Section */}
                <div className="p-5 border-b border-neutral-800">
                    <div className="mb-4 relative">
                        {/* Search Input */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-neutral-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search players..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Minimal input styling
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                        />
                    </div>

                    {/* Role Filter Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                                    selectedRole === role
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600 hover:text-white'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Player Grid / Content */}
                <div className="p-5">
                    {availablePlayers === undefined ? (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="animate-spin h-6 w-6 text-emerald-500 mb-3" />
                            <p className="text-neutral-400 text-sm">Loading players...</p>
                        </div>
                    ) : filteredPlayers.length > 0 ? (
                        /* Player List (Reduced grid columns and card size) */
                        <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                            {filteredPlayers.map((player) => (
                                <PlayerCard
                                    key={player._id}
                                    player={player}
                                    onSelect={handleSelectPlayer}
                                />
                            ))}
                        </div>
                    ) : (
                        /* No Players Found State */
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-12 h-12 mb-3 text-neutral-600">
                                <SadFaceIcon className="w-full h-full" />
                            </div>
                            <h3 className="text-base font-medium text-white mb-1">No players found</h3>
                            <p className="text-neutral-400 text-center text-sm max-w-xs">
                                {searchTerm
                                    ? `No players match "${searchTerm}"${selectedRole !== 'All' ? ` in ${selectedRole}` : ''}`
                                    : `No players available${selectedRole !== 'All' ? ` for ${selectedRole}` : ''}`}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Footer with Summary and Action */}
                <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-900 sticky bottom-0">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-neutral-400">
                            Showing <span className="font-semibold text-white">{filteredPlayers.length}</span> players
                            {selectedRole !== 'All' && ` • Role: ${selectedRole}`}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 rounded-lg text-neutral-300 bg-neutral-700 hover:bg-neutral-600 transition-colors font-medium text-sm"
                            >
                                Close
                            </button>
                            {filteredPlayers.length > 0 && (
                                <button
                                    onClick={() => handleSelectPlayer(filteredPlayers[0]._id)}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-600/30 transition-all text-sm"
                                >
                                    Add First
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SadFaceIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);