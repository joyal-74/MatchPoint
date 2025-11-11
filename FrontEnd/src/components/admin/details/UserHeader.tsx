import type { UserDetails } from "../../../features/admin/users/userTypes";

interface UserHeaderProps {
    user: UserDetails;
    onToggleBlock: () => void;
}

const UserHeader = ({ user, onToggleBlock }: UserHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className="relative">
                <img
                    src={user.profileImage || '/office-worker.png'}
                    alt="user Profile"
                    className="w-25 h-25 rounded-full shadow-lg"
                />
            </div>

            <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-emerald-400 mb-1">{user.fullName}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="px-2 py-1 bg-neutral-700 rounded-full text-xs font-medium text-neutral-300">
                        {user.role}
                    </span>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${user.isBlocked
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }`}
                    >
                        {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                </div>
                <p className="text-neutral-400 text-sm flex items-center justify-center sm:justify-start gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    Joined: {user.joinedAt}
                </p>
            </div>

            <button
                onClick={onToggleBlock}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 text-sm ${user.isBlocked
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                    }`}
            >
                {user.isBlocked ? "Unblock" : "Block"}
            </button>
        </div>
    );
};

export default UserHeader;