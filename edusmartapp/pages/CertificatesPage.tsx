
import React from 'react';
import { useLanguage } from '../i18n';
import Icon from '../components/Icon';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import CertificateCard from '../components/CertificateCard';

const CertificatesPage: React.FC = () => {
    const { t } = useLanguage();
    const { certificates } = useData();
    const { userId } = useAuth();

    const myCertificates = certificates.filter(c => c.studentId === userId);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-ui-text-primary tracking-tight">{t('myCertificates')}</h2>
                <p className="text-ui-text-secondary mt-2 max-w-2xl mx-auto text-lg">{t('myCertificatesDescription')}</p>
            </div>
            
            {myCertificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myCertificates.map(cert => (
                        <CertificateCard key={cert.id} certificate={cert} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-ui-card rounded-2xl shadow-apple">
                    <div className="w-24 h-24 bg-ui-primary/10 text-ui-primary mx-auto rounded-3xl flex items-center justify-center mb-8">
                        <Icon name="certificate" className="w-14 h-14" />
                    </div>
                    <h3 className="text-2xl font-bold text-ui-text-primary">{t('noCertificatesYet')}</h3>
                    <p className="text-ui-text-secondary mt-2">{t('noCertificatesDescription')}</p>
                </div>
            )}
        </div>
    );
};

export default CertificatesPage;