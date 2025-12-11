import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n';

const AIHubPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">{t('aiLearningHub')}</h2>
        <p className="text-ui-text-secondary mt-2 max-w-2xl mx-auto text-lg">{t('aiHubDescription')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
        <Link to="/ask-ai" className="block bg-ui-card p-8 rounded-3xl shadow-apple hover:shadow-apple-lg hover:-translate-y-2 transition-all duration-300 group">
          <div className="flex items-center justify-center h-16 w-16 bg-ui-blue/10 rounded-2xl mb-5">
            <Icon name="ai" className="h-9 w-9 text-ui-blue" />
          </div>
          <h3 className="text-2xl font-bold text-ui-text-primary group-hover:text-ui-primary tracking-tight">{t('aiAssistant')}</h3>
          <p className="text-ui-text-secondary mt-2 text-md">{t('aiAssistantDescription')}</p>
        </Link>
        
        <Link to="/study-engine" className="block bg-ui-card p-8 rounded-3xl shadow-apple hover:shadow-apple-lg hover:-translate-y-2 transition-all duration-300 group">
          <div className="flex items-center justify-center h-16 w-16 bg-ui-green/10 rounded-2xl mb-5">
            <Icon name="studyEngine" className="h-9 w-9 text-ui-green" />
          </div>
          <h3 className="text-2xl font-bold text-ui-text-primary group-hover:text-ui-green tracking-tight">{t('studyEngine')}</h3>
          <p className="text-ui-text-secondary mt-2 text-md">{t('studyEngineDescription')}</p>
        </Link>
      </div>
    </div>
  );
};

export default AIHubPage;