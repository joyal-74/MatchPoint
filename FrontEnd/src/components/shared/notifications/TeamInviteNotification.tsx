import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { teamInviteReponse } from "../../../features/player/playerThunks";
import type { Notification } from "../../../features/player/notifications/notificationTypes";
import { Users, Check, X } from "lucide-react";
import { timeAgo } from "../../../utils/helpers/dateUtils";
import { fetchNotifications, fetchUnreadCount } from "../../../features/player/notifications/notificationThunks";

interface Props {
    notification: Notification;
}

export default function TeamInviteNotification({ notification }: Props) {
    const dispatch = useAppDispatch();
    const playerId = useAppSelector(state => state.auth.user?._id);

    const inviteStatus = notification.meta?.inviteStatus ?? "pending";
    const isPending = inviteStatus === "pending";

    const containerClasses = isPending
        ? "border-l-primary bg-primary/5"
        : "border-l-muted bg-background/50 opacity-80";

    const handleResponse = async (status: "approved" | "rejected") => {
        if (!playerId || !notification.meta?.teamId || !isPending) return;

        await dispatch(
            teamInviteReponse({
                teamId: notification.meta.teamId,
                playerId,
                status
            })
        ).unwrap();

        dispatch(fetchNotifications(playerId));
        dispatch(fetchUnreadCount(playerId));
    };

    return (
        <div className={`
            p-4 border-l-4 transition-all duration-200 
            hover:bg-muted/50 group
            ${containerClasses}
        `}>
            <div className="flex gap-4">
                {/* Icon */}
                <div className="mt-1 shrink-0">
                    <div className="p-2.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Users size={18} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-foreground leading-tight">
                            {notification.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                            {timeAgo(notification.createdAt)}
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {notification.message}
                    </p>

                    {/* Actions / Status */}
                    <div className="pt-1">
                        {isPending ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResponse("approved");
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold py-1.5 px-3 rounded-md transition-all shadow-sm active:scale-95"
                                >
                                    <Check size={14} /> Accept
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResponse("rejected");
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-background border border-input text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-xs font-semibold py-1.5 px-3 rounded-md transition-all active:scale-95"
                                >
                                    <X size={14} /> Decline
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {inviteStatus === "approved" && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-md border border-green-500/20">
                                        <Check size={12} /> Accepted
                                    </span>
                                )}
                                {inviteStatus === "rejected" && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-1 rounded-md border border-destructive/20">
                                        <X size={12} /> Declined
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}