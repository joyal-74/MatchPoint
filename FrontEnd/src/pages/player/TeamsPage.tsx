import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchTeams, joinTeam } from '../../features/player/Teams/teamThunks';
import type { Team, Filters } from '../../components/player/Teams/Types';
import Navbar from '../../components/player/Navbar';
import SearchBar from '../../components/player/Teams/SearchBar';
import TeamFilters from '../../components/player/Teams/TeamFilters';
import TeamCard from '../../components/player/Teams/TeamCard';
import TeamListItem from '../../components/player/Teams/TeamListItem';
import Pagination from '../../components/player/Teams/Pagination';
import TeamModal from '../../components/player/Teams/TeamModal';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { toast } from 'react-toastify';

const TeamFinder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allTeams, loading } = useSelector((state: RootState) => state.playerTeams);
    console.log(allTeams)
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
    const [sortBy, setSortBy] = useState('mostActive');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const params = {
            ...filters,
            search: searchQuery,
            sort: sortBy,
            page: currentPage,
            limit: itemsPerPage
        };
        dispatch(fetchTeams(params));
    }, [filters, searchQuery, sortBy, currentPage, dispatch, itemsPerPage]);

    // Update filteredTeams from Redux store
    useEffect(() => {
        setFilteredTeams(allTeams);
    }, [allTeams]);

    // Filter change handler
    const handleFilterChange = (filterName: keyof Filters, value: string | number) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setCurrentPage(1); // reset pagination
    };

    const clearFilters = () => {
        setFilters({ sport: '', state: '', city: '', phase: undefined, maxPlayers: undefined });
        setSearchQuery('');
        setCurrentPage(1);
    };


    const openTeamDetails = (team: Team) => { setSelectedTeam(team); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSelectedTeam(null); };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeams = filteredTeams.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleJoinTeam = async () => {
        if (!selectedTeam?._id || !user?._id) return;
        const result = await dispatch(joinTeam({ playerId: selectedTeam?._id, teamId : user?._id }))
        if(joinTeam.fulfilled.match(result)){
            toast.success("Team join request submitted")
            closeModal();
        }else{
            toast.error(result.payload)
        }
        console.log(result.payload)
        closeModal();
    }

    return (
        <>
            <LoadingOverlay show={loading} />
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300">
                <div className="container mx-auto py-8 mt-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                                Pick Your Perfect
                            </span>
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                                &nbsp;Team
                            </span>
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                            Discover cricket teams looking for players. Filter by sport, location, phase, and more to find your ideal match.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8">
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onToggleFilters={() => setShowFilters(!showFilters)}
                        />

                        <TeamFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            showFilters={showFilters}
                            teams={Array.isArray(allTeams) ? allTeams : []}
                        />
                    </div>

                    {/* Results Summary */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Pick your Teams</h2>
                            <p className="text-neutral-600 dark:text-neutral-400">{filteredTeams.length} teams found</p>
                        </div>

                        <div className="flex space-x-2 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg">
                            <button
                                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-600 shadow-sm' : 'text-neutral-500 dark:text-neutral-400'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-3 bg-current rounded-sm"></div>)}
                                </div>
                            </button>
                            <button
                                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-neutral-600 shadow-sm' : 'text-neutral-500 dark:text-neutral-400'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <div className="flex flex-col space-y-1">
                                    {[1, 2, 3].map(i => <div key={i} className="w-3 h-1 bg-current rounded-sm"></div>)}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Teams */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentTeams.map(team => (
                                <TeamCard
                                    key={team._id}
                                    team={team}
                                    onViewDetails={openTeamDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8">
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
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                    )}
                </div>

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
        </>
    );
};

export default TeamFinder;