import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { teamInviteReponse } from "../../../features/player/playerThunks";
import type { Notification } from "../../../features/player/notifications/notificationTypes";
import { Users, Check, X } from "lucide-react";
import { timeAgo } from "../../../utils/helpers/dateUtils";
import {
    fetchNotifications,
    fetchUnreadCount
} from "../../../features/player/notifications/notificationThunks";

interface Props {
    notification: Notification;
}

export default function TeamInviteNotification({ notification }: Props) {
    const dispatch = useAppDispatch();
    const playerId = useAppSelector(state => state.auth.user?._id);

    const inviteStatus = notification.meta?.inviteStatus ?? "pending";
    const isPending = inviteStatus === "pending";
    const isRead = notification.isRead;

    const handleResponse = async (status: "approved" | "rejected") => {
        if (!playerId || !notification.meta?.teamId || !isPending) return;

        await dispatch(
            teamInviteReponse({
                teamId: notification.meta.teamId,
                playerId,
                status
            })
        ).unwrap();

        // backend updates inviteStatus + isRead
        dispatch(fetchNotifications(playerId));
        dispatch(fetchUnreadCount(playerId));
    };

    return (
        <div
            className={`
                p-4 border-l-2 border-l-blue-500 transition-all
                ${isRead ? "opacity-60" : "bg-neutral-800/20"}
                hover:bg-neutral-800/40
            `}
        >
            <div className="flex gap-3">
                {/* Icon */}
                <div className="mt-1 p-2 h-fit rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Users size={18} />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-white">
                            {notification.title}
                        </p>
                        <span className="text-[10px] text-neutral-500">
                            {timeAgo(notification.createdAt)}
                        </span>
                    </div>

                    <p className="text-xs text-neutral-400 mt-1 mb-3">
                        {notification.message}
                    </p>

                    {/* Invite actions OR status */}
                    {isPending ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleResponse("approved")}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-all active:scale-95"
                            >
                                <Check size={14} /> Accept
                            </button>

                            <button
                                onClick={() => handleResponse("rejected")}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-red-900/30 hover:text-red-400 border border-neutral-700 text-neutral-300 text-xs font-medium py-1.5 px-3 rounded-md transition-all active:scale-95"
                            >
                                <X size={14} /> Reject
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {inviteStatus === "approved" && (
                                <span className="text-xs font-semibold text-green-400">
                                    ✓ Accepted
                                </span>
                            )}
                            {inviteStatus === "rejected" && (
                                <span className="text-xs font-semibold text-red-400">
                                    ✕ Rejected
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
