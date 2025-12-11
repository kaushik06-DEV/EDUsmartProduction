import React from 'react';
import Icon, { IconName } from '../components/Icon';
import { useLanguage } from '../i18n';

const FeatureCard: React.FC<{ icon: IconName; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-ui-card p-6 rounded-2xl shadow-apple text-center">
        <div className="w-16 h-16 bg-ui-primary/10 text-ui-primary mx-auto rounded-2xl flex items-center justify-center mb-4">
            <Icon name={icon} className="h-9 w-9" />
        </div>
        <h3 className="text-xl font-bold text-ui-text-primary">{title}</h3>
        <p className="mt-2 text-md text-ui-text-secondary">{description}</p>
    </div>
);


const AboutPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">{t('aboutAppName')}</h2>
                <p className="text-ui-text-secondary mt-4 max-w-3xl mx-auto text-lg">{t('aboutDescription')}</p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon="ai" 
                    title={t('featureAITitle')}
                    description={t('featureAIDescription')}
                />
                 <FeatureCard 
                    icon="studyEngine" 
                    title={t('featureStudyTitle')}
                    description={t('featureStudyDescription')}
                />
                 <FeatureCard 
                    icon="courses" 
                    title={t('featureCoursesTitle')}
                    description={t('featureCoursesDescription')}
                />
            </div>

             <div className="mt-16 bg-ui-card p-8 rounded-2xl shadow-apple">
                <h3 className="text-3xl font-bold text-ui-text-primary text-center tracking-tight">{t('ourMission')}</h3>
                <p className="text-ui-text-secondary mt-4 max-w-4xl mx-auto text-lg text-center">{t('ourMissionDescription')}</p>
             </div>
        </div>
    );
};

export default AboutPage;
