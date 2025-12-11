

import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/index';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import Icon from './Icon';
import SideNav from './SideNav';

const Header: React.FC = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const { effectiveRole } = useAuth();
    const [isNavOpen, setIsNavOpen] = useState(false);
    
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const getTitleKey = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/dashboard')) return 'dashboard';
        if (path.startsWith('/courses')) return 'courses';
        if (path.startsWith('/ai-hub')) return 'aiHub';
        if (path.startsWith('/tasks')) return 'tasks';
        if (path.startsWith('/request-book')) return 'requestBook';
        if (path.startsWith('/profile')) return 'profile';
        if (path.startsWith('/settings')) return 'settings';
        if (path.startsWith('/admin')) return 'adminPanel';
        if (path.startsWith('/tutor')) return 'tutorPanel';
        if (path.startsWith('/study-engine')) return 'studyEngine';
        if (path === '/hackathons') return 'hackathons';
        if (path.startsWith('/hackathons/')) return 'hackathon';
        if (path === '/about') return 'about';
        if (path === '/certificates') return 'myCertificates';
        return 'appName';
    };

    return (
        <>
            <header className="bg-white/80 backdrop-blur-lg border-b border-ui-border px-4 h-16 sticky top-0 z-20 flex items-center justify-between">
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={toggleNav}
                        className="p-2 rounded-full text-ui-text-secondary hover:bg-ui-hover hover:text-ui-text-primary transition-colors"
                        aria-label={t('openMenu')}
                    >
                        <Icon name="menu" className="w-6 h-6" />
                    </button>
                </div> 
                
                <div className="flex-1 flex justify-center">
                    <h1 className="text-lg font-semibold text-ui-text-primary whitespace-nowrap">{t(getTitleKey())}</h1>
                </div>

                <div className="flex-1 flex justify-end items-center space-x-2">
                    {effectiveRole === 'Student' && <NotificationBell />}
                    <Link
                        to="/profile"
                        className="p-2 rounded-full text-ui-text-secondary hover:bg-ui-hover hover:text-ui-text-primary transition-colors"
                        aria-label={t('profile')}
                    >
                        <Icon name="profile" className="w-6 h-6" />
                    </Link>
                </div>
            </header>
            <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </>
    );
};

export default Header;