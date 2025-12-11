import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import Icon from '../../components/Icon';
import { Task } from '../../types';

const UpcomingTask: React.FC<{ task: Task }> = ({ task }) => (
    <div className="flex items-center p-4 bg-ui-hover rounded-xl">
        <div className="w-5 h-5 rounded-md border-2 border-ui-text-secondary mr-4"></div>
        <p className="text-md text-ui-text-primary">{task.text}</p>
    </div>
);

const QuickAction: React.FC<{ to: string; title: string; icon: React.ReactNode }> = ({ to, title, icon }) => (
    <Link to={to} className="flex items-center p-4 bg-ui-hover rounded-xl hover:bg-ui-border transition-colors group">
        <div className="p-2 rounded-lg mr-4 bg-white shadow-sm group-hover:bg-ui-hover">
            {icon}
        </div>
        <span className="font-semibold text-ui-text-primary">{title}</span>
    </Link>
);


const StudentHomePage: React.FC = () => {
    const { courses, tasks, adminInstructions, getStudentProfileById } = useData();
    const { userId } = useAuth();
    const { t } = useLanguage();
    
    const student = userId ? getStudentProfileById(userId) : null;
    const userName = student ? student.name.split(' ')[0] : null;

    const recentCourses = courses.slice(0, 4);
    const upcomingTasks = tasks.filter(task => !task.completed).slice(0, 3);
    const latestAnnouncement = adminInstructions.length > 0 ? adminInstructions[0] : null;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
            <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">
                    {userName ? t('welcomeUser', { name: userName }) : t('welcomeBack')}
                </h2>
                <p className="text-ui-text-secondary mt-2 text-lg">{t('studentQuote')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-ui-text-primary tracking-tight">{t('myCourses')}</h3>
                            <Link to="/courses" className="text-md font-medium text-ui-primary hover:underline">{t('viewAll')}</Link>
                        </div>
                        {recentCourses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {recentCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-ui-text-secondary bg-ui-card rounded-2xl shadow-apple">
                                <p className="text-lg">{t('noCoursesAvailable')}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8 sticky top-28">
                     <div className="bg-ui-card p-6 rounded-2xl shadow-apple space-y-4">
                        <h3 className="text-xl font-bold text-ui-text-primary tracking-tight">{t('quickActions')}</h3>
                        <QuickAction to="/ai-hub" title={t('aiHub')} icon={<Icon name="studyEngine" className="w-6 h-6 text-accent-purple" />} />
                        <QuickAction to="/ask-ai" title={t('askAI')} icon={<Icon name="ai" className="w-6 h-6 text-accent-blue" />} />
                        <QuickAction to="/request-book" title={t('requestBook')} icon={<Icon name="requestBook" className="w-6 h-6 text-accent-green" />} />
                    </div>
                    <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-ui-text-primary tracking-tight">{t('upcomingTasks')}</h3>
                             <Link to="/tasks" className="text-sm font-medium text-ui-primary hover:underline">{t('viewAllTasks')}</Link>
                        </div>
                        {upcomingTasks.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingTasks.map(task => <UpcomingTask key={task.id} task={task} />)}
                            </div>
                        ) : (
                             <p className="text-ui-text-secondary text-center py-4">{t('noUpcomingTasks')}</p>
                        )}
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

export default StudentHomePage;
