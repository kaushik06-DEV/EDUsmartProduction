
import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../i18n';
import Icon from '../../components/Icon';
import { api } from '../../services/apiService';

type BackendUser = { _id: string; id?: string; name: string; email?: string; role: 'student'|'tutor'|'admin'; rollNumber?: string; profile?: { phone?: string } };

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

const AdminHomePage: React.FC = () => {
    const { courses, certificates } = useData();
    const { t } = useLanguage();

    const [students, setStudents] = useState<BackendUser[]>([]);
    const [tutors, setTutors] = useState<BackendUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const users = await api.get<BackendUser[]>('/users');
                setStudents((users || []).filter(u => u.role === 'student'));
                setTutors((users || []).filter(u => u.role === 'tutor'));
            } catch (e: any) {
                setError(e.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">
                    {t('adminDashboardTitle')}
                </h2>
                <p className="text-ui-text-secondary mt-2 text-lg">{t('systemOverview')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('totalStudents')} value={students.length} icon={<Icon name="students" className="w-7 h-7 text-accent-blue" />} />
                <StatCard title={t('totalTutors')} value={tutors.length} icon={<Icon name="tutor" className="w-7 h-7 text-accent-yellow" />} />
                <StatCard title={t('totalCourses')} value={courses.length} icon={<Icon name="courses" className="w-7 h-7 text-accent-purple" />} />
                <StatCard title={t('certificates')} value={certificates.length} icon={<Icon name="certificate" className="w-7 h-7 text-accent-green" />} />
            </div>

            {error && <p className="text-center text-ui-red font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    <h3 className="text-2xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('students')}</h3>
                    {loading ? (
                        <p className="text-ui-text-secondary">{t('loading')}...</p>
                    ) : students.length ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {students.map(s => (
                                <div key={s._id || s.id} className="p-4 bg-ui-hover rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-ui-text-primary">{s.name}</p>
                                        <p className="text-sm text-ui-text-secondary">{s.rollNumber || s.email || s.profile?.phone || '-'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-ui-text-secondary">{t('noDataAvailable')}</p>
                    )}
                </div>
                <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    <h3 className="text-2xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('tutors')}</h3>
                    {loading ? (
                        <p className="text-ui-text-secondary">{t('loading')}...</p>
                    ) : tutors.length ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {tutors.map(s => (
                                <div key={s._id || s.id} className="p-4 bg-ui-hover rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-ui-text-primary">{s.name}</p>
                                        <p className="text-sm text-ui-text-secondary">{s.email || s.profile?.phone || '-'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-ui-text-secondary">{t('noDataAvailable')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
