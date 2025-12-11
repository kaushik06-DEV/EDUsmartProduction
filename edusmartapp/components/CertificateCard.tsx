
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { Certificate } from '../types';

interface CertificateCardProps {
    certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
    const issueDate = new Date(certificate.issueDate).toLocaleDateString();

    return (
        <Link 
            to={`/certificates/${certificate.id}`}
            className="block bg-ui-card rounded-2xl shadow-apple hover:shadow-apple-lg hover:-translate-y-1.5 transition-all duration-300 group"
        >
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-ui-primary/10 rounded-xl text-ui-primary">
                        <Icon name="award" className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-ui-text-primary group-hover:text-ui-primary transition-colors">{certificate.certificateName}</h3>
                        <p className="text-sm text-ui-text-secondary">{certificate.department}</p>
                    </div>
                </div>
                <p className="text-md text-ui-text-secondary mt-2">
                    Awarded for completion of <span className="font-semibold text-ui-text-primary">{certificate.className}</span>.
                </p>
            </div>
            <div className="mt-auto border-t border-ui-border p-4 px-6 flex justify-between items-center text-sm">
                <span className="font-semibold text-ui-text-secondary">Issued on: {issueDate}</span>
                <span className="font-semibold text-ui-primary group-hover:underline">View &rarr;</span>
            </div>
        </Link>
    );
};

export default CertificateCard;
