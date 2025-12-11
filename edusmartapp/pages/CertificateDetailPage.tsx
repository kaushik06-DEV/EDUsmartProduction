
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n';

const CertificateDetailPage: React.FC = () => {
    const { certificateId } = useParams<{ certificateId: string }>();
    const { getCertificateById } = useData();
    const { t } = useLanguage();

    const certificate = certificateId ? getCertificateById(certificateId) : null;

    if (!certificate) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-ui-red">{t('certificateNotFound')}</h2>
                <Link to="/certificates" className="text-ui-primary hover:underline mt-4 inline-block">&larr; {t('backToMyCertificates')}</Link>
            </div>
        );
    }

    const issueDate = new Date(certificate.issueDate).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Basic styling for overlaid text for readability over various backgrounds
    const textShadowStyle = { textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
             <div className="mb-4">
                 <Link to="/certificates" className="text-md font-medium text-ui-primary hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    {t('backToMyCertificates')}
                </Link>
            </div>
            <div 
                style={{ backgroundImage: `url(${certificate.imageUrl})` }}
                className="relative w-full aspect-[1.414] bg-cover bg-center rounded-xl shadow-apple-lg border-4 border-white flex flex-col justify-between p-8 text-white"
            >
                {/* Overlay to improve text readability */}
                <div className="absolute inset-0 bg-black/30 rounded-lg"></div>

                <div className="relative z-10 text-center">
                    <p className="text-xl sm:text-2xl font-light" style={textShadowStyle}>{certificate.department}</p>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2" style={textShadowStyle}>{certificate.certificateName}</h1>
                </div>

                <div className="relative z-10 text-center">
                    <p className="text-lg sm:text-xl" style={textShadowStyle}>{t('thisIsToCertifyThat')}</p>
                    <p className="text-3xl sm:text-4xl font-bold mt-2" style={textShadowStyle}>{certificate.studentName}</p>
                    <p className="text-md sm:text-lg font-mono" style={textShadowStyle}>{certificate.studentRollNumber}</p>
                    <p className="text-lg sm:text-xl mt-4" style={textShadowStyle}>has successfully completed the class</p>
                    <p className="text-2xl sm:text-3xl font-semibold mt-1" style={textShadowStyle}>{certificate.className}</p>
                </div>
                
                <div className="relative z-10 flex justify-between items-end text-sm sm:text-base">
                    <div className="text-center">
                        <p className="font-semibold" style={textShadowStyle}>{issueDate}</p>
                        <hr className="my-1 border-white/50" />
                        <p className="text-xs" style={textShadowStyle}>{t('dateOfIssue')}</p>
                    </div>
                     <div className="text-center">
                        <p className="font-semibold" style={textShadowStyle}>{certificate.tutorName}</p>
                        <hr className="my-1 border-white/50" />
                        <p className="text-xs" style={textShadowStyle}>{t('issuingAuthority')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDetailPage;
