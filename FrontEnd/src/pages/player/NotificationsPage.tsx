import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import NotificationItem from "../../components/player/notifications/NotificationItem";
import { CheckCheck, Trash2, Inbox, Bell } from "lucide-react";
import { markAllAsRead, clearAllNotifications } from "../../features/player/notifications/notificationSlice";

export default function NotificationsPage() {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(s => s.notifications.items);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    // Derived state for filtering
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="px-4 bg-background text-foreground ">
            <div className="max-w-7xl mx-auto space-y-4 ">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary" />
                            Notifications
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            You have <span className="text-foreground font-semibold">{unreadCount}</span> unread messages
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <button
                                onClick={() => dispatch(markAllAsRead())}
                                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                            >
                                <CheckCheck size={16} />
                                Mark all read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={() => dispatch(clearAllNotifications())}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full transition-colors"
                            >
                                <Trash2 size={16} />
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    
                    {/* Tab Navigation */}
                    <div className="flex items-center px-6 border-b border-border">
                        <button
                            onClick={() => setFilter('all')}
                            className={`py-4 mr-6 text-sm font-medium border-b-2 transition-all ${
                                filter === 'all'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            All Notifications
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`py-4 text-sm font-medium border-b-2 transition-all ${
                                filter === 'unread'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Unread Only
                        </button>
                    </div>

                    {/* List Content */}
                    <div className="min-h-[400px]">
                        {filteredNotifications.length === 0 ? (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                                <div className="p-4 bg-muted/50 rounded-full">
                                    <Inbox size={48} className="opacity-40" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-foreground">No notifications found</p>
                                    <p className="text-sm mt-1">
                                        {filter === 'unread'
                                            ? "You're all caught up!"
                                            : "We'll let you know when something arrives."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Notification List
                            <div className="divide-y divide-border">
                                {filteredNotifications.map(n => (
                                    <NotificationItem key={n._id} notification={n} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}