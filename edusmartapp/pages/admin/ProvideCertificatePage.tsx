
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../i18n';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const ProvideCertificatePage: React.FC = () => {
    const { certificates } = useData();
    const { t } = useLanguage();

    const sortedCertificates = [...certificates].reverse(); // Show newest first

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ui-text-primary tracking-tight mb-8">{t('allIssuedCertificates')}</h2>
            
            <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                {sortedCertificates.length > 0 ? (
                    <div className="space-y-4">
                        {sortedCertificates.map(cert => (
                            <div key={cert.id} className="p-4 bg-ui-hover rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex-1 mb-2 sm:mb-0">
                                    <p className="font-bold text-lg text-ui-primary">{cert.certificateName}</p>
                                    <p className="text-md text-ui-text-secondary">
                                        {t('student')}: <span className="font-semibold">{cert.studentName} ({cert.studentRollNumber})</span>
                                    </p>
                                    <p className="text-sm text-ui-text-secondary">
                                        {t('issuedBy')}: {cert.tutorName} - {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link 
                                    to={`/certificates/${cert.id}`}
                                    className="bg-white text-ui-primary font-semibold py-2 px-4 rounded-lg border border-ui-border hover:bg-ui-primary/5 transition-colors text-sm"
                                >
                                    {t('viewDetails')}
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 text-ui-text-secondary">
                        <Icon name="certificate" className="w-16 h-16 mx-auto text-ui-border" />
                        <p className="mt-4 text-xl font-semibold">{t('noCertificatesIssued')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProvideCertificatePage;
