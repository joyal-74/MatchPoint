import { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, Users, UserPlus, Filter, Frown, Check } from 'lucide-react';
import type { TeamPlayer } from '../../../types/Player';

interface PlayerSelectionModalProps {
    availablePlayers: TeamPlayer[] | undefined;
    onClose: () => void;
    onAddPlayer: (playerId: string, userId: string) => void;
}

// --- Sub-Component: Player Row ---
const PlayerListItem = ({ player, onAdd }: { player: TeamPlayer; onAdd: () => void }) => {
    return (
        <button
            onClick={onAdd}
            className="
                group w-full flex items-center justify-between p-3 rounded-lg
                border border-transparent hover:border-border/50
                hover:bg-accent hover:text-accent-foreground
                transition-all duration-200 text-left outline-none focus:bg-accent
            "
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-bold text-sm overflow-hidden">
                        {player.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Status Dot (Decoration) */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></div>
                </div>

                {/* Info */}
                <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {player.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium group-hover:text-accent-foreground/70">
                        {player.role || 'Player'}
                    </p>
                </div>
            </div>

            {/* Action Icon - Visible on Hover */}
            <div className="
                p-2 rounded-md text-muted-foreground/50 
                group-hover:text-primary group-hover:bg-primary/10 
                transition-all opacity-0 group-hover:opacity-100 group-focus:opacity-100
            ">
                <UserPlus size={18} />
            </div>
        </button>
    );
};

// --- Main Component ---
export default function PlayerSelectionModal({
    availablePlayers,
    onClose,
    onAddPlayer,
}: PlayerSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('All');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus search on mount
    useEffect(() => {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }, []);

    // Extract unique roles
    const roles = useMemo(() => {
        if (!availablePlayers) return ['All'];
        const uniqueRoles = [...new Set(availablePlayers.map(p => p.role))];
        return ['All', ...uniqueRoles].sort();
    }, [availablePlayers]);

    // Filter Logic
    const filteredPlayers = useMemo(() => {
        if (!availablePlayers) return [];
        return availablePlayers.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'All' || player.role === selectedRole;
            return matchesSearch && matchesRole;
        });
    }, [availablePlayers, searchTerm, selectedRole]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="
                relative w-full max-w-lg flex flex-col max-h-[85vh]
                bg-card text-card-foreground 
                border border-border rounded-xl shadow-2xl 
                animate-in fade-in zoom-in-95 duration-200
            ">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Add to Roster
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Search for players to invite to your squad.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search & Filter Section */}
                <div className="p-4 space-y-4 bg-muted/30">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="
                                w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-input bg-background 
                                text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                transition-all
                            "
                        />
                    </div>

                    {/* Role Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Filter size={14} className="text-muted-foreground shrink-0 mr-1" />
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border
                                    ${selectedRole === role
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                    }
                                `}
                            >
                                {selectedRole === role && <Check size={10} strokeWidth={3} />}
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto p-2 min-h-[300px]">
                    {!availablePlayers ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span className="text-sm">Loading players...</span>
                        </div>
                    ) : filteredPlayers.length > 0 ? (
                        <div className="space-y-1 p-2">
                            <div className="flex justify-between items-center px-2 mb-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Available
                                </span>
                                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                                    {filteredPlayers.length}
                                </span>
                            </div>
                            {filteredPlayers.map((player) => (
                                <PlayerListItem
                                    key={player._id}
                                    player={player}
                                    onAdd={() => onAddPlayer(player._id, player.userId)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3 opacity-70">
                            <Frown size={48} strokeWidth={1.5} className="text-muted-foreground/50" />
                            <div className="text-center">
                                <p className="text-foreground font-medium">No players found</p>
                                <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/10 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}