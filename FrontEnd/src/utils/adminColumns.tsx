import ViewButton from "../components/ui/ViewButton";
import StatusButton from "../components/ui/StatusButton";
import type { SignupRole } from "../types/UserRoles";
import type { User } from "../types/User";
import type { Team, Tournament } from "../features/admin/tournament/tournamentTypes";
import { DateCell } from "./helpers/DateCallHelp";

// ==========================================
// USER MANAGEMENT COLUMNS
// ==========================================

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

// ==========================================
// TOURNAMENT & TEAM COLUMNS
// ==========================================

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

export const getTournamentColumns = (handleStatusChange: (id: string, newStatus: boolean) => void) => [
    {
        id: "id",
        label: "ID",
        accessor: "_id" as keyof Tournament,
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
                {/* Note: Logic inverted here based on isBlocked vs isActive naming */}
                <StatusButton
                    isActive={!row.isBlocked}
                    onBlock={() => handleStatusChange(row._id, false)}
                    onActivate={() => handleStatusChange(row._id, true)}
                    showText={true}
                />
            </div>
        ),
    },
];