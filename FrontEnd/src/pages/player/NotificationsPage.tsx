import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import NotificationItem from "../../components/player/notifications/NotificationItem";
import { CheckCheck, Trash2, Inbox } from "lucide-react";
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
            <div className="pt-10 px-4 pb-12">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Notifications
                            </h1>
                            <p className="text-neutral-400 mt-2">
                                You have <span className="text-white font-medium">{unreadCount}</span> unread notifications
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => dispatch(markAllAsRead())}
                                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 rounded-full text-sm font-medium text-neutral-300 hover:text-white transition-all"
                                >
                                    <CheckCheck size={16} />
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => dispatch(clearAllNotifications())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabs & Content Wrapper */}
                    <div>
                        {/* Tab Navigation - Clean Line Style */}
                        <div className="flex items-center gap-8 border-b border-neutral-800 mb-6">
                            <button
                                onClick={() => setFilter('all')}
                                className={`pb-3 text-sm font-medium border-b-2 transition-all ${
                                    filter === 'all'
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                                }`}
                            >
                                All Notifications
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`pb-3 text-sm font-medium border-b-2 transition-all ${
                                    filter === 'unread'
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                                }`}
                            >
                                Unread Only
                            </button>
                        </div>

                        {/* List Content */}
                        <div className="min-h-[400px]">
                            {filteredNotifications.length === 0 ? (
                                // Empty State
                                <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-4">
                                    <div className="p-4 bg-neutral-900 rounded-full">
                                        <Inbox size={48} className="opacity-40" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-neutral-400">No notifications found</p>
                                        <p className="text-sm mt-1">
                                            {filter === 'unread'
                                                ? "You're all caught up!"
                                                : "We'll let you know when something arrives."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // Notification List - No Box, just items
                                <div className="space-y-1">
                                    {filteredNotifications.map(n => (
                                        <div key={n._id}>
                                            <NotificationItem notification={n} />
                                            <div className="h-px bg-neutral-800/50 my-1" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
}