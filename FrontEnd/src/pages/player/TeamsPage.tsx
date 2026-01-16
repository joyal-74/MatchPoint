import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGrid, List, Search, Users } from 'lucide-react';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchTeams, joinTeam } from '../../features/player/Teams/teamThunks';
import type { Team, Filters } from '../../components/player/Teams/Types';
import Navbar from '../../components/player/Navbar';
import SearchBar from '../../components/player/Teams/SearchBar';
import TeamCard from '../../components/player/Teams/TeamCard';
import TeamListItem from '../../components/player/Teams/TeamListItem';
import Pagination from '../../components/player/Teams/Pagination';
import TeamModal from '../../components/player/Teams/TeamModal';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { toast } from 'react-toastify';

const TeamFinderPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allTeams, loading } = useSelector((state: RootState) => state.playerTeams);
    const { user } = useSelector((state: RootState) => state.auth);

    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [filters, setFilters] = useState<Filters>({
        sport: '',
        state: '',
        city: '',
        phase: undefined,
        maxPlayers: undefined
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const params = {
            ...filters,
            search: searchQuery,
            page: currentPage,
            limit: itemsPerPage
        };
        dispatch(fetchTeams(params));
    }, [filters, searchQuery, currentPage, dispatch, itemsPerPage]);

    useEffect(() => {
        setFilteredTeams(allTeams);
    }, [allTeams]);


    const clearFilters = () => {
        setFilters({ sport: '', state: '', city: '', phase: undefined, maxPlayers: undefined });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const openTeamDetails = (team: Team) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTeam(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeams = filteredTeams.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleJoinTeam = async () => {
        if (!selectedTeam?._id || !user?._id) return;
        const result = await dispatch(joinTeam({ playerId: user?._id, teamId: selectedTeam?._id }));
        if (joinTeam.fulfilled.match(result)) {
            toast.success("Team join request submitted");
            closeModal();
        } else {
            toast.error(result.payload as string);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <LoadingOverlay show={loading} />
            <Navbar />
            
            {/* Header Section */}
            <header className="pt-2 pb-12 px-6 border-b border-border bg-card/50">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
                        <Users size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Find Your <span className="text-primary">Dream Team</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Connect with cricket teams actively seeking talented players. 
                        Use advanced filters to discover your perfect match.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Search & Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                    <div className="w-full sm:w-1/2 lg:w-1/3">
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg border border-border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === 'grid' 
                                ? 'bg-background text-primary shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === 'list' 
                                ? 'bg-background text-primary shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Teams Display */}
                {currentTeams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Teams Found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            We couldn't find any teams matching your search. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {currentTeams.map(team => (
                                    <TeamCard
                                        key={team._id}
                                        team={team}
                                        onViewDetails={openTeamDetails}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                {currentTeams.map(team => (
                                    <TeamListItem
                                        key={team._id}
                                        team={team}
                                        onViewDetails={openTeamDetails}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredTeams.length > itemsPerPage && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={paginate}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Team Modal */}
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