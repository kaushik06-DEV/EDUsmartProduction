
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/index';
import { Link } from 'react-router-dom';

type LoginRole = 'Student' | 'Tutor' | 'Admin';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<LoginRole>('Student');
  const [credentials, setCredentials] = useState({ identifier: '', credential: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setCredentials({ identifier: '', credential: '' });
  }, [activeTab]);

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(activeTab, credentials.identifier, credentials.credential);
    } catch (err: any) {
      setError(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    let identifierConfig = { label: '', type: 'text', placeholder: '', autoComplete: '' };
    let credentialConfig: { label: string; type: string; placeholder: string; autoComplete: string } | null = null;
    let buttonText = '';

    switch (activeTab) {
      case 'Admin':
        identifierConfig = { label: t('phoneNumber'), type: 'tel', placeholder: 'Enter phone number', autoComplete: 'tel' };
        credentialConfig = { label: t('password'), type: 'password', placeholder: 'Enter password', autoComplete: 'current-password' };
        buttonText = t('loginAsAdmin');
        break;
      case 'Tutor':
        identifierConfig = { label: t('email'), type: 'email', placeholder: 'Enter email', autoComplete: 'email' };
        credentialConfig = { label: t('password'), type: 'password', placeholder: 'Enter password', autoComplete: 'current-password' };
        buttonText = t('loginAsTutor');
        break;
      case 'Student':
      default:
        identifierConfig = { label: t('rollNumber'), type: 'text', placeholder: 'Enter roll number', autoComplete: 'username' };
        credentialConfig = { label: t('password'), type: 'password', placeholder: 'Enter your password', autoComplete: 'current-password' };
        buttonText = t('loginAsStudent');
        break;
    }

    return (
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="identifier" className="block text-md font-medium text-ui-text-secondary">{identifierConfig.label}</label>
          <div className="mt-1">
            <input
              id="identifier"
              name="identifier"
              type={identifierConfig.type}
              autoComplete={identifierConfig.autoComplete}
              required
              value={credentials.identifier}
              onChange={handleCredentialChange}
              className="appearance-none block w-full px-4 py-3 bg-white border-2 border-ui-border rounded-xl text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary sm:text-sm transition"
              placeholder={identifierConfig.placeholder}
            />
          </div>
        </div>
        {credentialConfig && (
            <div>
              <label htmlFor="credential" className="block text-md font-medium text-ui-text-secondary">{credentialConfig.label}</label>
              <div className="mt-1">
                 <input
                  id="credential"
                  name="credential"
                  type={credentialConfig.type}
                  autoComplete={credentialConfig.autoComplete}
                  required
                  value={credentials.credential}
                  onChange={handleCredentialChange}
                  className="appearance-none block w-full px-4 py-3 bg-white border-2 border-ui-border rounded-xl text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary sm:text-sm transition"
                  placeholder={credentialConfig.placeholder}
                />
              </div>
            </div>
        )}
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-semibold text-white bg-ui-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ui-primary transition-all transform hover:scale-105 active:scale-100 disabled:bg-gray-400 disabled:scale-100">
          {isLoading ? t('authenticating') : buttonText}
        </button>
      </form>
    );
  };

  const TabButton: React.FC<{ role: LoginRole; icon: 'profile' | 'tutor' | 'admin' }> = ({ role, icon }) => (
    <button
      type="button"
      onClick={() => setActiveTab(role)}
      className={`flex-1 py-2.5 px-1 text-center text-md font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ui-primary/50 ${
        activeTab === role
          ? 'bg-white text-ui-primary shadow-md'
          : 'text-ui-text-secondary hover:bg-white/60'
      }`}
    >
        <Icon name={icon} className="w-5 h-5 mx-auto mb-1" />
        {role}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-ui-background p-4">
      <div className="w-full max-w-md p-8 sm:p-12 space-y-8 bg-ui-card rounded-3xl shadow-apple-lg">
        <div className="text-center">
            <div className="w-16 h-16 bg-ui-primary text-white mx-auto rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 4a1 1 0 00-.606.92l.5 9A1 1 0 004 17h12a1 1 0 00.994-.999l.5-9a1 1 0 00-.606-.92l-7-4zM10 14a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </div>
          <h1 className="text-3xl font-bold text-ui-text-primary mt-4 tracking-tight">{t('welcomeToAppName')}</h1>
          <p className="mt-1 text-ui-text-secondary text-md">{t('loginPrompt')}</p>
        </div>

        <div className="bg-ui-hover p-1.5 rounded-xl flex space-x-1">
          <TabButton role="Student" icon="profile" />
          <TabButton role="Tutor" icon="tutor" />
          <TabButton role="Admin" icon="admin" />
        </div>
        
        <div className="mt-6">
            {error && <p className="text-center text-ui-red font-semibold mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
            {renderForm()}
        </div>
        {activeTab === 'Student' && (
            <p className="text-center text-md text-ui-text-secondary">
                {t('noAccountPrompt')} <Link to="/register" className="font-semibold text-ui-primary hover:underline">{t('register')}</Link>
            </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;