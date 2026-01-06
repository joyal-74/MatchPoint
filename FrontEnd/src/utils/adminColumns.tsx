import ViewButton from "../components/ui/ViewButton";
import StatusButton from "../components/ui/StatusButton";
import type { SignupRole } from "../types/UserRoles";
import type { User } from "../types/User";
import type { Team, Tournament } from "../features/admin/tournament/tournamentTypes";
import { DateCell } from "./helpers/DateCallHelp";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Transaction, Wallet } from "../features/admin/transaction/transactionTypes";

// USER MANAGEMENT COLUMNS

export const getViewerColumns = (
    handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void,
    navigate: (path: string) => void
) => [
        {
            id: "userId",
            label: "User ID",
            accessor: "userId" as keyof User,
            className: "w-24 text-muted-foreground"
        },
        {
            id: "name",
            label: "Customer Name",
            // Pushes content apart
            className: "min-w-[200px]",
            render: (row: User) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.firstName} {row.lastName}</span>
                </div>
            )
        },
        {
            id: "email",
            label: "Email Address",
            accessor: "email" as keyof User,
            className: "hidden md:table-cell min-w-[200px] text-muted-foreground"
        },
        {
            id: "joined",
            label: "Joined",
            className: "text-center hidden sm:table-cell",
            render: (row: User) => <DateCell date={row.createdAt} />
        },
        {
            id: "controls",
            label: "Controls",
            className: "text-right",
            render: (row: User) => (
                <div className="flex items-center justify-end gap-2">
                    <ViewButton onClick={() => navigate(`/admin/viewers/${row._id}/details`)} />
                    <StatusButton
                        isActive={row.isActive}
                        onBlock={() => handleStatusChange('viewer', row._id, false)}
                        onActivate={() => handleStatusChange('viewer', row._id, true)}
                        showText={true}
                    />
                </div>
            ),
        },
    ];

export const getManagerColumns = (
    handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void,
    navigate: (path: string) => void
) => [
        {
            id: "userId",
            label: "Manager ID",
            accessor: "userId" as keyof User,
            className: "w-24 text-muted-foreground"
        },
        {
            id: "name",
            label: "Name",
            // Pushes content apart
            className: "min-w-[200px]",
            render: (row: User) => (
                <span className="font-medium text-foreground">{row.firstName} {row.lastName}</span>
            )
        },
        {
            id: "email",
            label: "Contact",
            accessor: "email" as keyof User,
            className: "hidden md:table-cell min-w-[200px] text-muted-foreground"
        },
        {
            id: "joined",
            label: "Joined",
            className: "text-center hidden sm:table-cell",
            render: (row: User) => <DateCell date={row.createdAt} />
        },
        {
            id: "controls",
            label: "Controls",
            className: "text-right",
            render: (row: User) => (
                <div className="flex items-center justify-end gap-2">
                    <ViewButton onClick={() => navigate(`/admin/managers/${row._id}/details`)} />
                    <StatusButton
                        isActive={row.isActive}
                        onBlock={() => handleStatusChange("manager", row._id, false)}
                        onActivate={() => handleStatusChange("manager", row._id, true)}
                        showText={true}
                    />
                </div>
            ),
        },
    ];

export const getPlayerColumns = (
    handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void,
    navigate: (path: string) => void
) => [
        {
            id: "userId",
            label: "ID",
            accessor: "userId" as keyof User,
            className: "w-24 text-muted-foreground"
        },
        {
            id: "name",
            label: "Player",
            // Pushes content apart
            className: "min-w-[200px]",
            render: (row: User) => (
                <div>
                    <span className="font-medium text-foreground block">{row.firstName} {row.lastName}</span>
                </div>
            )
        },
        {
            id: "sport",
            label: "Sport",
            accessor: "sport" as keyof User,
            className: "hidden md:table-cell min-w-[100px] text-muted-foreground"
        },
        {
            id: "email",
            label: "Email",
            accessor: "email" as keyof User,
            className: "hidden md:table-cell min-w-[200px] text-muted-foreground"
        },
        {
            id: "joined",
            label: "Joined",
            className: "text-center hidden sm:table-cell",
            render: (row: User) => <DateCell date={row.createdAt} />
        },
        {
            id: "controls",
            label: "Controls",
            className: "text-right",
            render: (row: User) => (
                <div className="flex items-center justify-end gap-2">
                    <ViewButton onClick={() => navigate(`/admin/players/${row._id}/details`)} />
                    <StatusButton
                        isActive={row.isActive}
                        onBlock={() => handleStatusChange('player', row._id, false)}
                        onActivate={() => handleStatusChange('player', row._id, true)}
                        showText={true}
                    />
                </div>
            ),
        },
    ];

// TOURNAMENT & TEAM COLUMNS

export const getTeamColumns = (handleStatusChange: (id: string, newStatus: 'active' | 'blocked') => void, navigate: (path: string) => void) => [
    {
        id: "teamId",
        label: "Team ID",
        accessor: "teamId" as keyof Team,
        className: "w-24 text-muted-foreground"
    },
    {
        id: "name",
        label: "Team Details",
        // Pushes content apart
        className: "min-w-[200px]",
        render: (row: Team) => (
            <div>
                <div className="font-medium text-foreground">{row.name}</div>
            </div>
        )
    },
    {
        id: "sport",
        label: "Sport",
        className: "hidden md:table-cell min-w-[100px] text-muted-foreground",
        render: (row: Team) => `${row.sport}`
    },
    {
        id: "managerId",
        label: "Manager",
        className: "hidden md:table-cell min-w-[100px] text-muted-foreground",
        render: (row: Team) => `${row.managerName}`
    },
    {
        id: "members",
        label: "Size",
        className: "hidden md:table-cell min-w-[100px] text-muted-foreground",
        render: (row: Team) => `${row.membersCount || 0}/${row.maxPlayers} Members`
    },
    {
        id: "joined",
        label: "Created",
        className: "text-center hidden sm:table-cell",
        render: (row: Team) => <DateCell date={row.createdAt} />
    },
    {
        id: "controls",
        label: "Controls",
        className: "text-right",
        render: (row: Team) => (
            <div className="flex items-center justify-end gap-2">
                <ViewButton onClick={() => navigate(`/admin/teams/${row._id}/details`)} />
                <StatusButton
                    isActive={row.status == 'active'}
                    onBlock={() => handleStatusChange(row._id, 'blocked')}
                    onActivate={() => handleStatusChange(row._id, 'active')}
                    showText={true}
                />
            </div>
        ),
    },
];

export const getTournamentColumns = (handleStatusChange: (id: string, newStatus: boolean) => void, navigate: (path: string) => void) => [
    {
        id: "id",
        label: "ID",
        accessor: "tourId" as keyof Tournament,
        className: "w-24 max-w-[100px] truncate text-muted-foreground"
    },
    {
        id: "name",
        label: "Tournament",
        // Pushes content apart
        className: "min-w-[200px]",
        render: (row: Tournament) => (
            <div>
                <div className="font-medium text-foreground">{row.title}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{row.sport}</div>
            </div>
        )
    },
    {
        id: "teams",
        label: "Teams",
        className: "hidden md:table-cell min-w-[100px] text-muted-foreground",
        render: (row: Tournament) => `${row.currTeams || 0} Teams`
    },
    {
        id: "created",
        label: "Date",
        className: "text-center hidden sm:table-cell",
        render: (row: Tournament) => <DateCell date={row.createdAt} />
    },
    {
        id: "controls",
        label: "Controls",
        className: "text-right",
        render: (row: Tournament) => (
            <div className="flex items-center justify-end gap-2">
                <ViewButton onClick={() => navigate(`/admin/tournament/${row._id}/details`)} />
                <StatusButton
                    isActive={!row.isBlocked}
                    onBlock={() => handleStatusChange(row._id, true)}
                    onActivate={() => handleStatusChange(row._id, false)}
                    showText={true}
                />
            </div>
        ),
    },
];

// transactions column

const getOwnerName = (wallet: Wallet) => {
    if (!wallet || !wallet.ownerId) return "Unknown";
    return wallet.ownerId.name || wallet.ownerId.title || `${wallet.ownerId.firstName} ${wallet.ownerId.lastName}` || "Unknown ID";
};

const getOwnerEmail = (wallet: Wallet) => {
    if (!wallet || !wallet.ownerId) return "";
    return wallet.ownerId.email || wallet.ownerType || "";
};

export const getTransactionColumns = (
    onViewDetails: (id: string) => void
) => [
        {
            id: "paymentRefId",
            label: "Reference",
            render: (txn: Transaction) => (
                <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-500 font-medium">
                        {txn.paymentRefId || (txn._id ? txn._id.substring(0, 8) : "N/A")}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{txn.paymentProvider}</span>
                </div>
            ),
        },
        {
            id: "fromWalletId",
            label: "From / To",
            render: (txn: Transaction) => (
                <div className="flex flex-col text-xs max-w-[180px]">
                    {/* FROM */}
                    <div className="flex items-center gap-1 text-gray-500">
                        <span className="text-[10px] w-8">From:</span>
                        {txn.fromWalletId ? (
                            <span className="font-medium text-gray-700 truncate" title={getOwnerEmail(txn.fromWalletId)}>
                                {getOwnerName(txn.fromWalletId)}
                            </span>
                        ) : (
                            <span className="italic text-gray-400">External / Gateway</span>
                        )}
                    </div>

                    {/* TO */}
                    <div className="flex items-center gap-1 mt-1 text-gray-500">
                        <span className="text-[10px] w-8">To:</span>
                        {txn.toWalletId ? (
                            <span className="font-medium text-gray-700 truncate" title={getOwnerEmail(txn.toWalletId)}>
                                {getOwnerName(txn.toWalletId)}
                            </span>
                        ) : (
                            <span className="italic text-gray-400">System</span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "type",
            label: "Type",
            render: (txn: Transaction) => {
                const styles: Record<string, string> = {
                    DEPOSIT: "bg-blue-50 text-blue-700 border-blue-200",
                    WITHDRAWAL: "bg-orange-50 text-orange-700 border-orange-200",
                    ENTRY_FEE: "bg-purple-50 text-purple-700 border-purple-200",
                    PRIZE: "bg-pink-50 text-pink-700 border-pink-200",
                    COMMISSION: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    REFUND: "bg-red-50 text-red-700 border-red-200",
                    SUBSCRIPTION: "bg-indigo-50 text-indigo-700 border-indigo-200",
                };
                return (
                    <span className={`px-2 py-1 rounded border text-[10px] font-bold ${styles[txn.type] || "bg-gray-50 border-gray-200"}`}>
                        {txn.type.replace('_', ' ')}
                    </span>
                );
            },
        },
        {
            id: "amount",
            label: "Amount",
            render: (txn: Transaction) => {
                const isProfit = txn.type === 'SUBSCRIPTION';
                return (
                    <div className="flex items-center gap-1">
                        {isProfit ? <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> : <ArrowUpRight className="w-3 h-3 text-gray-400" />}
                        <span className={`font-bold ${isProfit ? "text-emerald-600" : "text-gray-800"}`}>
                            ₹{txn.amount.toLocaleString()}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "createdAt",
            label: "Date",
            render: (txn: Transaction) => (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">{new Date(txn.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-400">{new Date(txn.createdAt).toLocaleTimeString()}</span>
                </div>
            )
        },
        {
            id: "status",
            label: "Status",
            render: (txn: Transaction) => {
                const colors: Record<string, string> = {
                    SUCCESS: "bg-green-100 text-green-700 border-green-200",
                    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
                    FAILED: "bg-red-100 text-red-700 border-red-200",
                };
                return (
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${colors[txn.status]}`}>
                        {txn.status}
                    </span>
                );
            },
        },
        {
            id: "controls",
            label: "Controls",
            className: "text-right",
            render: (txn: Transaction) => (
                <div className="flex items-center justify-end gap-2">
                    <ViewButton onClick={() => onViewDetails(txn._id)} />
                </div>
            ),
        },
    ];