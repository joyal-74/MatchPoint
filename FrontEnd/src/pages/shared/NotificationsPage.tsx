import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import NotificationItem from "../../components/shared/notifications/NotificationItem";
import { CheckCheck, Trash2, Sparkles } from "lucide-react";
import { deleteNotifications, markAllNotificationRead } from "../../features/player/notifications/notificationThunks";
import toast from "react-hot-toast";


export default function NotificationsPage() {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(s => s.notifications.items);
    const userId = useAppSelector(s => s.auth.user?._id);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = useMemo(() => {
        return filter === 'unread'
            ? notifications.filter(n => !n.isRead)
            : notifications;
    }, [notifications, filter]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleDeleteAll = async () => {
        if (!userId) return;

        const count = await dispatch(deleteNotifications(userId)).unwrap();

        if (count > 0) {
            toast.success(`Cleared ${count} notifications`);
        } else {
            toast.error("No notifications to clear");
        }
    };

    return (
        <div className="w-full bg-background animate-in fade-in duration-700">
            {/* --- Top Utility Bar --- */}
            <div className="flex items-center justify-between px-6 pb-5 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex bg-muted/30 p-1 rounded-full border border-border/50">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${filter === 'unread' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                                }`}
                        >
                            Unread {unreadCount > 0 && `(${unreadCount})`}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={() => dispatch(markAllNotificationRead(userId!))}
                                title="Mark all as read"
                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <CheckCheck size={20} />
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                title="Clear all"
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Content Area --- */}
            <div className="w-full">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Sparkles size={32} className="text-primary/40 mb-4" strokeWidth={1} />
                        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            {filter === 'unread' ? "Inbox Zero Reached" : "No Activity Yet"}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredNotifications.map((n) => (
                            <div
                                key={n._id}
                                className="group relative border-b border-border/40 hover:bg-muted/20 transition-all duration-300"
                            >
                                {/* A subtle indicator bar for unread items */}
                                {!n.isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-70" />
                                )}

                                <div className="px-6 py-2">
                                    <NotificationItem notification={n} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Footer Status --- */}
            {notifications.length > 0 && (
                <div className="px-6 py-12 text-center leading-relaxed">
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em]">
                        End of updates
                    </p>
                </div>
            )}
        </div>
    );
}