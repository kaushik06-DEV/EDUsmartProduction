import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n/index';
import Icon from '../components/Icon';

const StudentsListPage: React.FC = () => {
    const { studentProfiles } = useData();
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ui-text-primary mb-8 tracking-tight">{t('students')}</h2>

            {studentProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {studentProfiles.map(student => (
                        <Link 
                            to={`/students/${student.id}`} 
                            key={student.id} 
                            className="bg-ui-card p-6 rounded-2xl shadow-apple hover:shadow-apple-lg hover:-translate-y-1 transition-all duration-300 flex items-center space-x-5 group"
                        >
                            <img src={student.photoUrl} alt={student.name} className="w-20 h-20 rounded-full flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-ui-text-primary group-hover:text-ui-primary transition-colors">{student.name}</h3>
                                <p className="text-md text-ui-text-secondary">{student.rollNumber}</p>
                                <p className="text-sm text-ui-text-secondary mt-1 line-clamp-1">{student.program}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-ui-text-secondary bg-ui-card rounded-2xl shadow-apple">
                    <p className="text-lg">{t('selectStudentToView')}</p>
                </div>
            )}
        </div>
    );
};

export default StudentsListPage;