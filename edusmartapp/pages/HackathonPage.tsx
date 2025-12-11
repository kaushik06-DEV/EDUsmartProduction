
import React from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

const HackathonsListPage: React.FC = () => {
    const { hackathons } = useData();
    const { t } = useLanguage();

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">{t('hackathons')}</h2>
                <p className="text-ui-text-secondary mt-2 max-w-2xl mx-auto text-lg">{t('upcomingHackathons')}</p>
            </div>

            {hackathons && hackathons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hackathons.map(hackathon => (
                        <Link 
                            to={`/hackathons/${hackathon.id}`} 
                            key={hackathon.id}
                            className="bg-ui-card rounded-2xl shadow-apple hover:shadow-apple-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                        >
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-ui-text-primary group-hover:text-ui-primary tracking-tight transition-colors">{hackathon.title}</h3>
                                <p className="text-ui-text-secondary mt-1 text-md">{hackathon.theme}</p>
                                <p className="text-sm text-ui-text-secondary mt-4 line-clamp-3 h-[60px]">{hackathon.description}</p>
                            </div>
                            <div className="mt-auto border-t border-ui-border p-6 flex justify-between items-center">
                                <div className="text-sm">
                                    <p className="font-semibold text-ui-text-primary">{formatDate(hackathon.startDate)}</p>
                                    <p className="text-ui-text-secondary">Start Date</p>
                                </div>
                                <span className="font-semibold text-ui-primary group-hover:underline">{t('viewDetails')} &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-ui-card rounded-2xl shadow-apple">
                    <h2 className="text-2xl font-bold text-ui-text-primary">{t('noHackathonActive')}</h2>
                    <p className="text-ui-text-secondary mt-2">{t('checkBackLater')}</p>
                </div>
            )}
        </div>
    );
};

export default HackathonsListPage;
