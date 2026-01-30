import { useState } from 'react';
import { LayoutGrid, List, Search, MapPin, Trophy, X, ChevronDown, Users } from 'lucide-react';
import Navbar from '../../components/player/Navbar';
import TeamCard from '../../components/player/Teams/TeamCard';
import TeamListItem from '../../components/player/Teams/TeamListItem';
import Pagination from '../../components/player/Teams/Pagination';
import TeamModal from '../../components/player/Teams/TeamModal';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { useTeamActions, useTeamData, useTeamFilters } from '../../hooks/player/useTeamFinderHooks';

const TeamFinderPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    const { 
        searchQuery, setSearchQuery, filters, updateFilter, clearFilters, hasActiveFilters 
    } = useTeamFilters();

    const { 
        currentTeams, allTeams, loading, user, pagination 
    } = useTeamData(filters, searchQuery);

    const { 
        selectedTeam, isModalOpen, openTeamDetails, closeModal, handleJoinTeam 
    } = useTeamActions(user);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
            <LoadingOverlay show={loading} />
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative bg-background border-b border-border/40 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                
                <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-5 max-w-2xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Dream Team</span>
                            </h1>
                            <p className="text-md text-muted-foreground leading-relaxed max-w-lg">
                                Connect with top-tier squads, showcase your talent, and level up your game.
                            </p>
                        </div>

                        <div className="hidden md:flex gap-4">
                            <div className="flex items-center gap-4 px-5 py-3 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl shadow-sm">
                                <div className="p-2.5 bg-blue-500/10 rounded-full text-blue-500">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase">Total Teams</p>
                                    <p className="text-base font-bold">{allTeams.length}+ Squads</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="sticky top-4 z-40 mx-auto px-4 sm:px-6 lg:px-8 -mt-10 w-full">
                <div className="bg-card/80 backdrop-blur-xl border border-border/60 shadow-lg shadow-black/5 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-4">
                    
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by team name..."
                            className="w-full h-12 pl-11 pr-4 bg-secondary/40 hover:bg-secondary/60 focus:bg-background rounded-xl text-base transition-all outline-none border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="hidden md:block w-px h-8 bg-border/60 self-center mx-1" />

                    <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-hide items-center">
                        <div className="relative min-w-[160px] group">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder="City"
                                value={filters.city}
                                onChange={(e) => updateFilter('city', e.target.value)}
                                className="w-full h-12 pl-11 pr-4 bg-secondary/40 hover:bg-secondary/60 focus:bg-background rounded-xl text-base transition-all outline-none border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div className="relative min-w-[160px] group">
                            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <select
                                value={filters.sport}
                                onChange={(e) => updateFilter('sport', e.target.value)}
                                className="w-full h-12 pl-11 pr-10 bg-secondary/40 hover:bg-secondary/60 focus:bg-background rounded-xl text-base transition-all outline-none border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                            >
                                <option value="">All Sports</option>
                                <option value="Cricket">Cricket</option>
                                <option value="Football">Football</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto pl-2 md:border-l md:border-border/60">
                        {hasActiveFilters && (
                            <button 
                                onClick={clearFilters}
                                className="h-12 px-4 flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                            >
                                <X size={16} />
                                <span className="hidden md:inline">Clear</span>
                            </button>
                        )}
                        
                        <div className="flex bg-secondary/60 p-1.5 rounded-xl border border-border/20">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                title="Grid View"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                title="List View"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="flex items-baseline justify-between mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Available Teams 
                        <span className="ml-3 text-base font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
                            {allTeams.length}
                        </span>
                    </h2>
                </div>

                {currentTeams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-card/30 rounded-3xl border border-dashed border-border/60">
                        <Search size={48} className="text-muted-foreground mb-6" />
                        <h3 className="text-3xl font-bold mb-4">No teams found</h3>
                        <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
                            We couldn't find any teams matching your current filters.
                        </p>
                        <button 
                            onClick={clearFilters} 
                            className="px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className={
                            viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10" 
                            : "flex flex-col gap-6 mx-auto"
                        }>
                            {currentTeams.map((team) => {
                                // Logic: Status based on member count
                                const isFull = team.members?.length >= team.maxPlayers;
                                const displayStatus = isFull ? 'Team Full' : 'Recruiting';

                                return (
                                    <div key={team._id} className={viewMode === 'grid' ? "h-full" : "w-full"}>
                                        {viewMode === 'grid' ? (
                                            <div className="h-full transition-transform duration-200 hover:-translate-y-1">
                                                <TeamCard
                                                    team={{...team, displayStatus, isFull}}
                                                    onViewDetails={openTeamDetails}
                                                />
                                            </div>
                                        ) : (
                                            <TeamListItem
                                                team={{...team, displayStatus, isFull}}
                                                onViewDetails={openTeamDetails}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {allTeams.length > pagination.itemsPerPage && (
                            <div className="mt-20 pt-10 border-t border-border/40 flex justify-center">
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={pagination.setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>

            {selectedTeam && (
                <TeamModal
                    team={selectedTeam}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleJoinTeam}
                />
            )}
        </div>
    );
};

export default TeamFinderPage;