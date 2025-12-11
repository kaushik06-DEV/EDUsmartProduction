
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../i18n';
import Icon from '../../components/Icon';

const CreateCertificatePage: React.FC = () => {
    const { studentProfiles, provideCertificate } = useData();
    const { t } = useLanguage();

    const [certificateName, setCertificateName] = useState('');
    const [className, setClassName] = useState('');
    const [department, setDepartment] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [studentSearch, setStudentSearch] = useState('');

    const filteredStudents = useMemo(() => {
        if (!studentSearch) return studentProfiles.slice(0, 100); // Limit initial list for performance
        return studentProfiles.filter(
            s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNumber.includes(studentSearch)
        ).slice(0, 100);
    }, [studentSearch, studentProfiles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!certificateName.trim() || !className.trim() || !department.trim() || !imageUrl.trim() || !selectedStudentId) {
            alert(t('fillAllFields'));
            return;
        }
        provideCertificate({
            studentId: selectedStudentId,
            certificateName,
            className,
            department,
            imageUrl
        });
        alert(t('certificateIssuedSuccess'));
        // Reset form
        setCertificateName('');
        setClassName('');
        setDepartment('');
        setImageUrl('');
        setSelectedStudentId('');
        setStudentSearch('');
    };
    
    const inputStyles = "w-full p-3 border-2 border-ui-border rounded-lg bg-ui-card text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition";

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ui-text-primary tracking-tight mb-8">{t('createCertificate')}</h2>

            <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="certificateName" className="block text-md font-medium text-ui-text-secondary mb-1">{t('certificateName')}</label>
                        <input id="certificateName" type="text" value={certificateName} onChange={e => setCertificateName(e.target.value)} placeholder="e.g., Certificate of Achievement" className={inputStyles} required />
                    </div>
                    <div>
                        <label htmlFor="className" className="block text-md font-medium text-ui-text-secondary mb-1">{t('className')}</label>
                        <input id="className" type="text" value={className} onChange={e => setClassName(e.target.value)} placeholder="e.g., Advanced JavaScript" className={inputStyles} required />
                    </div>
                     <div>
                        <label htmlFor="department" className="block text-md font-medium text-ui-text-secondary mb-1">{t('department')}</label>
                        <input id="department" type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g., Department of Computer Science" className={inputStyles} required />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-md font-medium text-ui-text-secondary mb-1">{t('certificateImageUrl')}</label>
                        <input id="imageUrl" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/certificate-background.png" className={inputStyles} required />
                    </div>
                    <hr className="border-ui-border" />
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
                    
                    <button type="submit" className="w-full bg-ui-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg">
                        <Icon name="award" className="w-6 h-6 mr-2" />
                        {t('issueCertificate')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCertificatePage;
