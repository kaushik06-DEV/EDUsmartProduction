
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/index';
import { useData } from '../contexts/DataContext';

const DashboardPage: React.FC = () => {
    const { t } = useLanguage();
    const { courses, certificates, notifications, hackathons, leaderboardData } = useData();

    const hasLeaderboard = Array.isArray(leaderboardData) && leaderboardData.length > 0;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ui-text-primary tracking-tight mb-8">{t('yourLearningDashboard')}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stat Cards (dynamic counts) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-ui-card p-6 rounded-2xl shadow-apple flex items-center">
                            <div className="bg-ui-blue/10 text-ui-blue p-3 rounded-xl">
                                <Icon name="courses" className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-ui-text-secondary text-md">{t('myCourses')}</p>
                                <p className="text-3xl font-bold text-ui-text-primary">{courses?.length || 0}</p>
                            </div>
                        </div>
                        <div className="bg-ui-card p-6 rounded-2xl shadow-apple flex items-center">
                            <div className="bg-ui-green/10 text-ui-green p-3 rounded-xl">
                                <Icon name="certificate" className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-ui-text-secondary text-md">{t('certificates')}</p>
                                <p className="text-3xl font-bold text-ui-text-primary">{certificates?.length || 0}</p>
                            </div>
                        </div>
                        <div className="bg-ui-card p-6 rounded-2xl shadow-apple flex items-center">
                            <div className="bg-ui-yellow/10 text-ui-yellow p-3 rounded-xl">
                                <Icon name="notification" className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-ui-text-secondary text-md">{t('notifications')}</p>
                                <p className="text-3xl font-bold text-ui-text-primary">{notifications?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Optional: hide chart since sample data removed */}
                    <div className="bg-ui-card p-6 sm:p-8 rounded-2xl shadow-apple">
                        <h3 className="text-xl font-bold text-ui-text-primary mb-2 tracking-tight">{t('weeklyStudyHours')}</h3>
                        <p className="text-ui-text-secondary">{t('noDataAvailable')}</p>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                        <h3 className="text-xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('hackathons')}</h3>
                        {hackathons?.length ? (
                            <p className="text-md text-ui-text-secondary">{hackathons.length} {t('available')}</p>
                        ) : (
                            <p className="text-md text-ui-text-secondary">{t('noDataAvailable')}</p>
                        )}
                    </div>

                    <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                        <h3 className="text-xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('leaderboard')}</h3>
                        {hasLeaderboard ? (
                            <div className="space-y-3">
                                {leaderboardData.slice(0, 5).map((entry) => (
                                    <div key={entry.studentId} className="flex items-center p-3 bg-ui-hover rounded-xl">
                                        <div className="flex-1">
                                            <p className="font-semibold text-ui-text-primary truncate">{entry.studentName}</p>
                                            <p className="text-sm text-ui-text-secondary">{entry.points} {t('points')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-md text-ui-text-secondary">{t('noDataAvailable')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;