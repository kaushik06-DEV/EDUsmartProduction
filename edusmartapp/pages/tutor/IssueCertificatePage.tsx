
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../i18n';
import Icon from '../../components/Icon';

const IssueCertificatePage: React.FC = () => {
    const { certificateTemplates, studentProfiles, issueCertificate } = useData();
    const { t } = useLanguage();

    const [selectedTemplateId, setSelectedTemplateId] = useState(certificateTemplates.length > 0 ? certificateTemplates[0].id : '');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [studentSearch, setStudentSearch] = useState('');

    const filteredStudents = useMemo(() => {
        if (!studentSearch) return studentProfiles.slice(0, 100); // Limit initial list
        return studentProfiles.filter(
            s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNumber.includes(studentSearch)
        ).slice(0, 100);
    }, [studentSearch, studentProfiles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemplateId || !selectedStudentId || !courseName.trim()) {
            alert(t('fillAllFields'));
            return;
        }
        issueCertificate({
            templateId: selectedTemplateId,
            studentId: selectedStudentId,
            courseName: courseName.trim()
        });
        alert(t('certificateIssuedSuccess'));
        // Reset form
        setSelectedStudentId('');
        setCourseName('');
        setStudentSearch('');
    };
    
    const inputStyles = "w-full p-3 border-2 border-ui-border rounded-lg bg-ui-card text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition";

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ui-text-primary tracking-tight mb-8">{t('issueCertificate')}</h2>

            <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="template" className="block text-md font-medium text-ui-text-secondary mb-1">{t('selectTemplate')}</label>
                        <select id="template" value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)} className={inputStyles} required disabled={certificateTemplates.length === 0}>
                           {certificateTemplates.length > 0 ? (
                                certificateTemplates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)
                           ) : (
                                <option value="" disabled>{t('noTemplatesExist')}</option>
                           )}
                        </select>
                    </div>

                     <div>
                        <label htmlFor="student-search" className="block text-md font-medium text-ui-text-secondary mb-1">{t('searchStudent')}</label>
                        <input type="text" id="student-search" value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder={t('searchStudentPlaceholder')} className={inputStyles} />
                    </div>

                    <div>
                        <label htmlFor="student" className="block text-md font-medium text-ui-text-secondary mb-1">{t('selectStudent')}</label>
                        <select id="student" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className={inputStyles} required>
                            <option value="" disabled>{t('selectAStudent')}</option>
                            {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="course-name" className="block text-md font-medium text-ui-text-secondary mb-1">{t('courseName')}</label>
                        <input type="text" id="course-name" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder={t('enterCourseName')} className={inputStyles} required />
                    </div>
                    
                    <button type="submit" className="w-full bg-ui-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg" disabled={certificateTemplates.length === 0}>
                        <Icon name="award" className="w-6 h-6 mr-2" />
                        {t('issueCertificate')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IssueCertificatePage;
