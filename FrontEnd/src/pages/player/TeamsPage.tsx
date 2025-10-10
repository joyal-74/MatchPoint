import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    useEffect(() => {
        setFilteredTeams(allTeams);
    }, [allTeams]);

    const handleFilterChange = (filterName: keyof Filters, value: string | number) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setCurrentPage(1);
    };

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
        const result = await dispatch(joinTeam({ playerId: selectedTeam?._id, teamId: user?._id }));
        if (joinTeam.fulfilled.match(result)) {
            toast.success("Team join request submitted");
            closeModal();
        } else {
            toast.error(result.payload);
        }
    };

    return (
        <>
            <LoadingOverlay show={loading} />
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-emerald-50/30 to-neutral-100 dark:from-neutral-900 dark:via-emerald-950/20 dark:to-neutral-800 transition-colors duration-300">

                {/* Header Section */}
                <div className="bg-gradient-to-b from-white/50 to-transparent dark:from-neutral-900/50 border-b border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-12 sm:mt-16">
                        <div className="text-center space-y-4 sm:space-y-6">
                            <div className="inline-block">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 blur-2xl opacity-20"></div>
                                    <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                                        <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 bg-clip-text text-transparent">
                                            Find Your
                                        </span>
                                        <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                                            &nbsp;Dream Team
                                        </span>
                                    </h1>
                                </div>
                            </div>

                            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-light px-4">
                                Connect with cricket teams actively seeking talented players.
                                <span className="hidden sm:inline"> Use advanced filters to discover your perfect match.</span>
                            </p>

                            {/* Stats Pills */}
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2 px-4">
                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                    <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">{filteredTeams.length}+ Teams</span>
                                </div>
                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800 shadow-sm">
                                    <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">Active Recruitment</span>
                                </div>
                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800 shadow-sm">
                                    <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">All Skill Levels</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8">

                    {/* Search Bar */}
                    <div className="mb-8 flex items-center justify-between">
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">View:</span>
                            <div className="flex space-x-1 bg-neutral-100/80 dark:bg-neutral-700/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-neutral-200 dark:border-neutral-600 shadow-sm">
                                <button
                                    className={`p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-600 dark:to-neutral-700 shadow-md scale-105 text-emerald-600 dark:text-emerald-400'
                                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                                        }`}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid View"
                                >
                                    <div className="flex space-x-0.5 sm:space-x-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-0.5 sm:w-1 h-2 sm:h-3 bg-current rounded-sm"></div>
                                        ))}
                                    </div>
                                </button>
                                <button
                                    className={`p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-600 dark:to-neutral-700 shadow-md scale-105 text-emerald-600 dark:text-emerald-400'
                                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                                        }`}
                                    onClick={() => setViewMode('list')}
                                    title="List View"
                                >
                                    <div className="flex flex-col space-y-0.5 sm:space-y-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-2 sm:w-3 h-0.5 sm:h-1 bg-current rounded-sm"></div>
                                        ))}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span className="font-medium">
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </span>
                            <span className="ml-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                                {Object.values(filters).filter(v => v).length}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Filters Sidebar */}
                        <aside className={`
                            ${showFilters ? 'block' : 'hidden'} 
                            lg:block 
                            w-full lg:w-50 xl:w-60 
                            flex-shrink-0
                        `}>
                            <div className="sticky top-24 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 p-4 sm:p-5 shadow-lg space-y-5">

                                {/* Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
                                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-base sm:text-lg uppercase tracking-wide">
                                        Filters
                                    </h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Sport Filter */}
                                <div>
                                    <h4 className="font-medium text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-3 uppercase tracking-wide">Sport</h4>
                                    <div className="space-y-2.5">
                                        {['Cricket', 'Football', 'Badminton', 'Basketball'].map(sport => (
                                            <label key={sport} className="flex items-center space-x-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.sport === sport}
                                                    onChange={() => handleFilterChange('sport', filters.sport === sport ? '' : sport)}
                                                    className="accent-emerald-600 w-4 h-4 rounded transition-transform group-hover:scale-110"
                                                />
                                                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {sport}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* State Filter */}
                                <div>
                                    <h4 className="font-medium text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-3 uppercase tracking-wide">State</h4>
                                    <div className="space-y-2.5">
                                        {['Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra'].map(state => (
                                            <label key={state} className="flex items-center space-x-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.state === state}
                                                    onChange={() => handleFilterChange('state', filters.state === state ? '' : state)}
                                                    className="accent-emerald-600 w-4 h-4 rounded transition-transform group-hover:scale-110"
                                                />
                                                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {state}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* City Filter */}
                                <div>
                                    <h4 className="font-medium text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-3 uppercase tracking-wide">City</h4>
                                    <div className="space-y-2.5">
                                        {['Kochi', 'Chennai', 'Bangalore', 'Mumbai'].map(city => (
                                            <label key={city} className="flex items-center space-x-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.city === city}
                                                    onChange={() => handleFilterChange('city', filters.city === city ? '' : city)}
                                                    className="accent-emerald-600 w-4 h-4 rounded transition-transform group-hover:scale-110"
                                                />
                                                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {city}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort Filter */}
                                <div>
                                    <h4 className="font-medium text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-3 uppercase tracking-wide">Sort By</h4>
                                    <div className="space-y-2.5">
                                        {[
                                            { label: 'Most Active', value: 'mostActive' },
                                            { label: 'Newest First', value: 'newest' },
                                            { label: 'Oldest First', value: 'oldest' },
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    value={option.value}
                                                    checked={sortBy === option.value}
                                                    onChange={() => setSortBy(option.value)}
                                                    className="accent-emerald-600 w-4 h-4 transition-transform group-hover:scale-110"
                                                />
                                                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 min-w-0">

                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                                        Available Teams
                                    </h2>
                                    
                                </div>
                            </div>

                            {/* Teams Display */}
                            {currentTeams.length === 0 ? (
                                <div className="text-center py-12 sm:py-16 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 px-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">No Teams Found</h3>
                                    <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-4">Try adjusting your filters or search query</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-5 sm:px-6 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                                    {currentTeams.map(team => (
                                        <TeamCard
                                            key={team._id}
                                            team={team}
                                            onViewDetails={openTeamDetails}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden mb-8 shadow-lg">
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
                                <div className="mt-6 sm:mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={paginate}
                                    />
                                </div>
                            )}
                        </main>
                    </div>
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

export default TeamFinderPage;