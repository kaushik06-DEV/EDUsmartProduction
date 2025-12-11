
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n';
import Icon, { IconName } from './Icon';
import { useNavigate } from 'react-router-dom';
import { Notification as NotificationType } from '../types';

const NotificationIcon: React.FC<{ type: NotificationType['type'] }> = ({ type }) => {
    const icons: Record<NotificationType['type'], IconName> = {
        announcement: 'admin',
        task: 'tasks',
        book: 'requestBook',
        new_user: 'profile'
    };
    return <Icon name={icons[type]} className="w-5 h-5" />;
};


const NotificationBell: React.FC = () => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: NotificationType) => {
        markNotificationAsRead(notification.id);
        if (notification.linkTo) {
            navigate(notification.linkTo);
        }
        setIsOpen(false);
    };

    const handleDelete = (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        deleteNotification(notificationId);
    };
    
    const handleMarkAllRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAllNotificationsAsRead();
    };

    const timeSince = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-ui-text-secondary hover:bg-ui-hover hover:text-ui-text-primary transition-colors"
                aria-label="Toggle notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-ui-red ring-2 ring-white" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-ui-card rounded-2xl shadow-apple-lg border border-ui-border z-30 animate-fade-in-up">
                    <div className="p-4 flex justify-between items-center border-b border-ui-border">
                        <h3 className="font-bold text-lg text-ui-text-primary">Notifications</h3>
                        {notifications.length > 0 && (
                             <button onClick={handleMarkAllRead} className="text-sm text-ui-primary font-semibold hover:underline">
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                            <p className="text-center text-ui-text-secondary p-8">You're all caught up!</p>
                        ) : (
                            <ul className="divide-y divide-ui-border">
                                {notifications.map(notification => (
                                    <li 
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 flex items-start space-x-3 hover:bg-ui-hover cursor-pointer transition-colors ${!notification.isRead ? 'bg-ui-blue/5' : ''}`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                                            notification.type === 'announcement' ? 'bg-blue-100 text-ui-blue' :
                                            notification.type === 'task' ? 'bg-yellow-100 text-yellow-600' :
                                            notification.type === 'book' ? 'bg-green-100 text-ui-green' :
                                            'bg-purple-100 text-accent-purple' // new_user
                                        }`}>
                                            <NotificationIcon type={notification.type} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-md text-ui-text-primary">{notification.text}</p>
                                            <p className="text-sm text-ui-text-secondary mt-1">{timeSince(notification.timestamp)}</p>
                                        </div>
                                         <button onClick={(e) => handleDelete(e, notification.id)} className="p-1 rounded-full text-ui-text-secondary hover:bg-ui-border">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                         </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
