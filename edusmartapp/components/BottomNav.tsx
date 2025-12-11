

import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon, { IconName } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/index';

const studentNavItems = [
  { path: '/', labelKey: 'home', icon: 'home' as IconName },
  { path: '/dashboard', labelKey: 'dashboard', icon: 'dashboard' as IconName },
  { path: '/courses', labelKey: 'courses', icon: 'courses' as IconName },
  { path: '/ai-hub', labelKey: 'aiHub', icon: 'studyEngine' as IconName },
  { path: '/hackathons', labelKey: 'hackathon', icon: 'hackathon' as IconName },
];

const adminNavItems = [
    { path: '/', labelKey: 'home', icon: 'home' as IconName },
    { path: '/dashboard', labelKey: 'dashboard', icon: 'dashboard' as IconName },
    { path: '/admin', labelKey: 'admin', icon: 'admin' as IconName },
    { path: '/courses', labelKey: 'courses', icon: 'courses' as IconName },
];

const tutorNavItems = [
    { path: '/', labelKey: 'home', icon: 'home' as IconName },
    { path: '/dashboard', labelKey: 'dashboard', icon: 'dashboard' as IconName },
    { path: '/tutor', labelKey: 'tutor', icon: 'tutor' as IconName },
    { path: '/students', labelKey: 'students', icon: 'students' as IconName },
    { path: '/courses', labelKey: 'courses', icon: 'courses' as IconName },
];

const BottomNav: React.FC = () => {
  const { effectiveRole } = useAuth();
  const { t } = useLanguage();
  
  let navItems;
  switch (effectiveRole) {
      case 'Admin':
          navItems = adminNavItems;
          break;
      case 'Tutor':
          navItems = tutorNavItems;
          break;
      default:
          navItems = studentNavItems;
          break;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-auto z-20">
      <div className="flex justify-around items-center space-x-1 bg-white/60 backdrop-blur-xl shadow-apple-lg sm:rounded-full p-2 border-t sm:border border-white/30 w-full sm:w-auto">
        {navItems.map((item) => {
          const isCentralButton = item.path === '/ai-hub';
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-12 rounded-full transition-all duration-300 flex-1 sm:flex-none ${
                  isCentralButton ? 'sm:w-20' : 'sm:w-16'
                } ${
                  isActive ? 'bg-ui-primary text-white' : 'text-ui-text-secondary hover:bg-white/50'
                }`
              }
            >
              <Icon name={item.icon} className="w-6 h-6" />
              <span className="text-[10px] font-medium mt-0.5">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;