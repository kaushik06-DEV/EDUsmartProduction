
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon, { IconName } from './Icon';
import { useLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{ to: string; icon: IconName; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        end // Use 'end' for the home route to avoid it matching everything
        className={({ isActive }) =>
            `flex items-center p-4 rounded-xl text-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-ui-primary/10 text-ui-primary font-semibold'
                    : 'text-ui-text-primary hover:bg-ui-hover'
            }`
        }
    >
        <Icon name={icon} className="w-6 h-6 mr-4" />
        <span>{label}</span>
    </NavLink>
);

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { effectiveRole } = useAuth();

    const navItems = [
        { to: '/', icon: 'home' as IconName, label: t('home') },
        { to: '/dashboard', icon: 'dashboard' as IconName, label: t('dashboard') },
        { to: '/courses', icon: 'courses' as IconName, label: t('myCourses') },
    ];
    
    if (effectiveRole === 'Admin') {
        navItems.push({ to: '/admin/certificates', icon: 'certificate' as IconName, label: t('provideCertificate') });
    } else { // Student and Tutor view their own certificates
        navItems.push({ to: '/certificates', icon: 'certificate' as IconName, label: t('myCertificates') });
    }

    navItems.push({ to: '/about', icon: 'info' as IconName, label: t('about') });
    
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />
            <nav
                className={`fixed top-0 left-0 h-full w-72 bg-ui-card shadow-apple-lg z-40 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                     <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-ui-primary text-white rounded-xl flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 4a1 1 0 00-.606.92l.5 9A1 1 0 004 17h12a1 1 0 00.994-.999l.5-9a1 1 0 00-.606-.92l-7-4zM10 14a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-ui-text-primary">{t('appName')}</span>
                    </div>
                    <div className="space-y-2">
                       {navItems.map(item => (
                           <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} onClick={onClose} />
                       ))}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default SideNav;
