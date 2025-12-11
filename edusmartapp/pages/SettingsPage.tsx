
import React, { useState } from 'react';
import { useLanguage } from '../i18n/index';
import Icon, { IconName } from '../components/Icon';

const SettingsRow: React.FC<{ label: string; icon: IconName; children?: React.ReactNode }> = ({ label, icon, children }) => (
    <div className="flex justify-between items-center p-2 rounded-lg">
        <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-ui-hover rounded-lg mr-4">
              <Icon name={icon} className="w-5 h-5 text-ui-text-secondary" />
            </div>
            <span className="text-ui-text-primary text-lg">{label}</span>
        </div>
        <div>
            {children}
        </div>
    </div>
);


const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState('system');

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-6">
        {/* Language Settings */}
        <div className="bg-ui-card rounded-2xl shadow-apple p-4">
            <SettingsRow label={t('language')} icon="language">
              <div className="flex items-center space-x-1 p-1 bg-ui-hover rounded-xl">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-1.5 rounded-lg text-md font-semibold transition-all ${language === 'en' ? 'bg-white shadow-md text-ui-primary' : 'text-ui-text-secondary'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-4 py-1.5 rounded-lg text-md font-semibold transition-all ${language === 'es' ? 'bg-white shadow-md text-ui-primary' : 'text-ui-text-secondary'}`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-4 py-1.5 rounded-lg text-md font-semibold transition-all ${language === 'ta' ? 'bg-white shadow-md text-ui-primary' : 'text-ui-text-secondary'}`}
                >
                  தமிழ்
                </button>
              </div>
            </SettingsRow>
        </div>

        {/* Account Management */}
        <div className="bg-ui-card rounded-2xl shadow-apple p-4 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-ui-hover cursor-pointer">
                  <div className="flex items-center">
                     <div className="w-8 h-8 flex items-center justify-center bg-ui-hover rounded-lg mr-4">
                        <Icon name="key" className="w-5 h-5 text-ui-text-secondary" />
                     </div>
                     <span className="text-ui-text-primary text-lg">{t('updatePassword')}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ui-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </div>
        </div>
        
        {/* Preferences */}
        <div className="bg-ui-card rounded-2xl shadow-apple p-4">
            <SettingsRow label={t('appTheme')} icon="theme">
              <div className="flex items-center space-x-1 p-1 bg-ui-hover rounded-xl">
                  <button onClick={() => setTheme('light')} className={`px-4 py-1.5 rounded-lg text-md font-semibold transition-all ${theme === 'light' ? 'bg-white shadow-md text-ui-primary' : 'text-ui-text-secondary'}`}>
                    {t('light')}
                  </button>
                  <button onClick={() => setTheme('dark')} className={`px-4 py-1.5 rounded-lg text-md font-semibold transition-all ${theme === 'dark' ? 'bg-white shadow-md text-ui-primary' : 'text-ui-text-secondary'}`}>
                    {t('dark')}
                  </button>
                  <button onClick={() => setTheme('system')} className={`px-4 py-1.5 rounded-lg text-md font-semibold transition-all ${theme === 'system' ? 'bg-white shadow-md text-ui-primary' : 'text-ui-text-secondary'}`}>
                    {t('system')}
                  </button>
              </div>
            </SettingsRow>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
