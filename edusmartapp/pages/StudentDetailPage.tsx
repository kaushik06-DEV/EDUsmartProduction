
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n/index';

const ProfileInfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-ui-border first:border-t-0">
        <dt className="text-md font-medium text-ui-text-secondary">{label}</dt>
        <dd className="mt-1 text-md text-ui-text-primary sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const StudentDetailPage: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { getStudentProfileById } = useData();
    const { t } = useLanguage();
    const student = studentId ? getStudentProfileById(studentId) : undefined;

    if (!student) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-3xl font-bold text-ui-red tracking-tight">{t('noStudentProfile')}</h2>
                <Link to="/students" className="mt-4 inline-block text-ui-primary hover:underline">
                    &larr; {t('backToStudents')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex justify-start mb-2">
                <Link to="/students" className="text-md font-medium text-ui-primary hover:underline flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    {t('backToStudents')}
                </Link>
            </div>
            
            <div className="bg-ui-card p-8 rounded-2xl shadow-apple flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-6">
                <img src={student.photoUrl} alt={t('profile')} className="w-28 h-28 rounded-full flex-shrink-0" />
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-ui-text-primary tracking-tight">{student.name}</h2>
                    <p className="text-ui-text-secondary mt-1 text-md sm:text-lg">{student.program}</p>
                </div>
            </div>

            <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                <h3 className="text-2xl font-bold text-ui-text-primary tracking-tight border-b border-ui-border pb-4 mb-4">{t('academicInformation')}</h3>
                <dl>
                    <ProfileInfoRow label={t('rollNumber')} value={student.rollNumber} />
                    <ProfileInfoRow label={t('year')} value={student.year} />
                    <ProfileInfoRow label={t('collegeEmail')} value={student.collegeEmail} />
                </dl>
            </div>
            
            <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                <h3 className="text-2xl font-bold text-ui-text-primary tracking-tight border-b border-ui-border pb-4 mb-4">{t('contactInformation')}</h3>
                <dl>
                    <ProfileInfoRow label={t('personalEmail')} value={student.personalEmail} />
                    <ProfileInfoRow label={t('phoneNumber')} value={student.phone} />
                    <ProfileInfoRow label={t('address')} value={student.address} />
                </dl>
            </div>
        </div>
    );
};

export default StudentDetailPage;