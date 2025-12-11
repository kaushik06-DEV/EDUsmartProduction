
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';
import Icon from '../../components/Icon';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-ui-card p-6 rounded-2xl shadow-apple flex items-center space-x-4">
        <div className="bg-ui-hover p-4 rounded-xl">
            {icon}
        </div>
        <div>
            <p className="text-md text-ui-text-secondary">{title}</p>
            <p className="text-3xl font-bold text-ui-text-primary">{value}</p>
        </div>
    </div>
);

const TutorHomePage: React.FC = () => {
    const { courses, studentProfiles, bookRequests, acceptBookRequest, adminInstructions, tutorProfile } = useData();
    const { t } = useLanguage();

    const pendingRequests = bookRequests.filter(r => r.status === 'Pending');
    const latestAnnouncement = adminInstructions.length > 0 ? adminInstructions[0] : null;
    const tutorName = tutorProfile ? tutorProfile.name.split(' ')[0] : '';
    
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">
                    {t('tutorDashboardGreeting', { name: tutorName })}
                </h2>
                <p className="text-ui-text-secondary mt-2 text-lg">{t('tutorDashboardDescription')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title={t('totalCourses')} value={courses.length} icon={<Icon name="courses" className="w-7 h-7 text-accent-purple" />} />
                 <StatCard title={t('totalStudents')} value={studentProfiles.length} icon={<Icon name="students" className="w-7 h-7 text-accent-blue" />} />
                 <StatCard title={t('pendingBookRequests')} value={pendingRequests.length} icon={<Icon name="requestBook" className="w-7 h-7 text-accent-yellow" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-ui-card p-8 rounded-2xl shadow-apple">
                    <h3 className="text-2xl font-bold text-ui-text-primary tracking-tight mb-4">{t('pendingBookRequests')}</h3>
                    {pendingRequests.length > 0 ? (
                        <ul className="space-y-3">
                            {pendingRequests.map(req => (
                                <li key={req.id} className="p-4 bg-ui-hover rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <p className="font-semibold text-ui-text-primary">{req.bookTitle}</p>
                                        <p className="text-sm text-ui-text-secondary">{t('forCourse')}: {req.courseName}</p>
                                    </div>
                                    <button 
                                        onClick={() => acceptBookRequest(req.id)} 
                                        className="mt-2 sm:mt-0 bg-accent-green text-white text-sm font-bold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-colors"
                                    >
                                        {t('accept')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-ui-text-secondary text-center py-10">{t('noPendingBookRequests')}</p>
                    )}
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-ui-card p-6 rounded-2xl shadow-apple space-y-4">
                        <h3 className="text-xl font-bold text-ui-text-primary tracking-tight">{t('quickActions')}</h3>
                         <Link to="/tutor" className="block w-full text-left p-4 bg-ui-hover rounded-xl hover:bg-ui-border transition-colors">
                            <p className="font-semibold text-ui-text-primary">{t('addNewCourse')}</p>
                         </Link>
                         <Link to="/students" className="block w-full text-left p-4 bg-ui-hover rounded-xl hover:bg-ui-border transition-colors">
                             <p className="font-semibold text-ui-text-primary">{t('manageStudents')}</p>
                         </Link>
                         <Link to="/tutor/issue-certificate" className="block w-full text-left p-4 bg-ui-hover rounded-xl hover:bg-ui-border transition-colors">
                             <p className="font-semibold text-ui-text-primary">{t('issueCertificate')}</p>
                         </Link>
                    </div>

                     {latestAnnouncement && (
                        <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                             <h3 className="text-xl font-bold text-ui-text-primary tracking-tight mb-3">{t('adminAnnouncements')}</h3>
                             <p className="text-md text-ui-text-secondary">{latestAnnouncement.text}</p>
                             <p className="text-xs text-ui-text-secondary mt-3 opacity-70">{t('postedOn')}: {new Date(latestAnnouncement.timestamp).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorHomePage;
