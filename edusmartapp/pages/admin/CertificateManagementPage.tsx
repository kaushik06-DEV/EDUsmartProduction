
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../i18n';
import Icon from '../../components/Icon';
import { CertificateTemplate } from '../../types';

const CertificateManagementPage: React.FC = () => {
    const { certificateTemplates, addCertificateTemplate, updateCertificateTemplate, deleteCertificateTemplate } = useData();
    const { t } = useLanguage();
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', issuingAuthority: '', imageUrl: '' });

    const handleOpenForm = (template: CertificateTemplate | null = null) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({ title: template.title, description: template.description, issuingAuthority: template.issuingAuthority, imageUrl: template.imageUrl || '' });
        } else {
            setEditingTemplate(null);
            setFormData({ title: '', description: '', issuingAuthority: '', imageUrl: '' });
        }
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
        setEditingTemplate(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            updateCertificateTemplate({ ...editingTemplate, ...formData });
            alert(t('templateUpdatedSuccess'));
        } else {
            addCertificateTemplate(formData);
            alert(t('templateCreatedSuccess'));
        }
        handleCloseForm();
    };

    const handleDelete = (templateId: string) => {
        if (window.confirm(t('confirmDeleteTemplate'))) {
            deleteCertificateTemplate(templateId);
            alert(t('templateDeletedSuccess'));
        }
    };
    
    const inputStyles = "w-full p-3 border-2 border-ui-border rounded-lg bg-ui-card text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition";

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-ui-text-primary tracking-tight">{t('certificateManagement')}</h2>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-ui-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-colors flex items-center"
                >
                    <Icon name="edit" className="w-5 h-5 mr-2" />
                    {t('createNewTemplate')}
                </button>
            </div>
            
            {isFormVisible && (
                <div className="bg-ui-card p-8 rounded-2xl shadow-apple mb-8 animate-fade-in-up">
                    <h3 className="text-2xl font-bold mb-4">{editingTemplate ? t('editTemplate') : t('createNewTemplate')}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t('templateTitle')} className={inputStyles} required />
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder={t('templateDescription')} className={inputStyles} rows={3} required />
                        <input type="text" name="issuingAuthority" value={formData.issuingAuthority} onChange={handleChange} placeholder={t('issuingAuthority')} className={inputStyles} required />
                        <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder={t('templateImageUrl')} className={inputStyles} />
                        <div className="flex justify-end space-x-3 pt-4">
                            <button type="button" onClick={handleCloseForm} className="bg-ui-hover text-ui-text-primary font-bold py-2 px-6 rounded-xl">{t('cancel')}</button>
                            <button type="submit" className="bg-ui-primary text-white font-bold py-2 px-6 rounded-xl">{t('saveTemplate')}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                <h3 className="text-2xl font-bold mb-6">{t('existingTemplates')}</h3>
                <div className="space-y-4">
                    {certificateTemplates.map(template => (
                        <div key={template.id} className="p-4 bg-ui-hover rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center space-x-4 flex-1">
                                {template.imageUrl && (
                                    <img src={template.imageUrl} alt="Seal" className="w-16 h-16 rounded-full object-cover flex-shrink-0 bg-white border" />
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-lg text-ui-primary">{template.title}</p>
                                    <p className="text-md text-ui-text-secondary break-words">{template.description}</p>
                                    <p className="text-sm text-ui-text-secondary italic mt-1">{t('issuedBy')}: {template.issuingAuthority}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3 sm:mt-0 self-end sm:self-center">
                                <button onClick={() => handleOpenForm(template)} className="p-2 text-ui-text-secondary hover:text-ui-primary hover:bg-ui-primary/10 rounded-full transition-colors"><Icon name="edit" className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(template.id)} className="p-2 text-ui-text-secondary hover:text-ui-red hover:bg-ui-red/10 rounded-full transition-colors"><Icon name="trash" className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                     {certificateTemplates.length === 0 && (
                        <p className="text-center text-ui-text-secondary py-8">{t('noTemplatesExist')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificateManagementPage;
