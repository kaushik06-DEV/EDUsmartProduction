
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/index';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import Icon, { IconName } from '../components/Icon';
import { StudentProfile, AdminProfile, TutorProfile } from '../types';

const EditableInfoRow: React.FC<{ label: string; name: string; value: string | number; isEditing: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: 'text' | 'number' | 'email' | 'tel' | 'date', area?: boolean }> = ({ label, name, value, isEditing, onChange, type = 'text', area = false }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-ui-border first:border-t-0">
        <dt className="text-md font-medium text-ui-text-secondary">{label}</dt>
        <dd className="mt-1 text-md text-ui-text-primary sm:mt-0 sm:col-span-2">
            {isEditing ? (
                area ? (
                     <textarea 
                        name={name}
                        value={value}
                        onChange={onChange}
                        rows={3}
                        className="w-full p-2 bg-white text-ui-text-primary border-2 border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition"
                    />
                ) : (
                    <input 
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="w-full p-2 bg-white text-ui-text-primary border-2 border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition"
                    />
                )
            ) : (
                <span className="whitespace-pre-wrap">{value}</span>
            )}
        </dd>
    </div>
);

const ActionRow: React.FC<{ to: string; label: string; icon: IconName }> = ({ to, label, icon }) => (
    <Link to={to} className="flex items-center p-4 -mx-4 rounded-xl hover:bg-ui-hover transition-colors group">
        <div className="bg-ui-background group-hover:bg-ui-border/50 p-3 rounded-xl mr-4 transition-colors">
            <Icon name={icon} className="w-6 h-6 text-ui-text-secondary" />
        </div>
        <span className="text-ui-text-primary font-semibold text-lg flex-1">{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ui-border group-hover:text-ui-text-secondary transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </Link>
);

const ProfilePage: React.FC = () => {
    const { role, effectiveRole, switchToStudentView, userId, logout } = useAuth();
    const { getStudentProfileById, adminProfile, tutorProfile, updateStudentProfile, updateAdminProfile, updateTutorProfile } = useData();
    const { t } = useLanguage();

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<any>(null);

    const getOriginalProfile = () => {
        if (effectiveRole === 'Admin') return adminProfile;
        if (effectiveRole === 'Tutor') return tutorProfile;
        if (effectiveRole === 'Student' && userId) return getStudentProfileById(userId);
        return null;
    };

    useEffect(() => {
        setEditedProfile(getOriginalProfile());
        setIsEditing(false); // Reset editing mode when role changes
    }, [effectiveRole, userId, adminProfile, tutorProfile]);

    const handleEditToggle = () => {
        if (isEditing) {
            setEditedProfile(getOriginalProfile()); // Cancel changes
        }
        setIsEditing(!isEditing);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProfile((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!editedProfile) return;
        if (effectiveRole === 'Admin') updateAdminProfile(editedProfile as AdminProfile);
        else if (effectiveRole === 'Tutor') updateTutorProfile(editedProfile as TutorProfile);
        else if (effectiveRole === 'Student') updateStudentProfile(editedProfile as StudentProfile);
        setIsEditing(false);
    };

    const renderProfileHeader = (profile: any, roleText: string) => (
         <div className="bg-ui-card p-8 rounded-2xl shadow-apple flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={profile.photoUrl} alt={t('profile')} className="w-28 h-28 rounded-full flex-shrink-0" />
            <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-ui-text-primary tracking-tight">{profile.name}</h2>
                <p className="text-ui-text-secondary mt-1 text-md sm:text-lg">{roleText}</p>
            </div>
        </div>
    );

    const renderEditControls = (title: string) => (
        <div className="flex justify-between items-center border-b border-ui-border pb-4 mb-4">
            <h3 className="text-2xl font-bold text-ui-text-primary tracking-tight">{title}</h3>
            {!isEditing && (
                <button onClick={handleEditToggle} className="flex items-center text-ui-primary font-semibold py-2 px-4 rounded-lg hover:bg-ui-hover transition-colors">
                    <Icon name="edit" className="w-5 h-5 mr-2" /> {t('edit')}
                </button>
            )}
        </div>
    );
     
    const renderSaveCancelButtons = () => (
        isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
                <button onClick={handleEditToggle} className="bg-ui-hover text-ui-text-primary font-bold py-2 px-6 rounded-xl hover:bg-ui-border transition-colors">{t('cancel')}</button>
                <button onClick={handleSave} className="bg-ui-primary text-white font-bold py-2 px-6 rounded-xl hover:bg-opacity-80 transition-colors">{t('save')}</button>
            </div>
        )
    );

    const renderAdminProfile = () => {
        if (!editedProfile) return null;
        return (
            <>
                {renderProfileHeader(editedProfile, editedProfile.title || t('adminRole'))}
                <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    {renderEditControls(t('contactInformation'))}
                    <dl>
                        <EditableInfoRow label={t('fullName')} name="name" value={editedProfile.name} isEditing={isEditing} onChange={handleProfileChange} />
                        <EditableInfoRow label={t('adminId')} name="adminId" value={editedProfile.adminId} isEditing={isEditing} onChange={handleProfileChange} />
                        <EditableInfoRow label={t('title')} name="title" value={editedProfile.title} isEditing={isEditing} onChange={handleProfileChange} />
                        <EditableInfoRow label={t('email')} name="email" value={editedProfile.email} isEditing={isEditing} onChange={handleProfileChange} type="email" />
                        <EditableInfoRow label={t('phoneNumber')} name="phone" value={editedProfile.phone} isEditing={isEditing} onChange={handleProfileChange} type="tel" />
                    </dl>
                    {renderSaveCancelButtons()}
                </div>
                <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                    <ActionRow to="/settings" label={t('appSettings')} icon="settings" />
                </div>
            </>
        );
    };

    const renderTutorProfile = () => {
         if (!editedProfile) return null;
         return (
             <>
                {renderProfileHeader(editedProfile, t('tutorRole'))}
                <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    {renderEditControls(t('contactInformation'))}
                    <dl>
                        <EditableInfoRow label={t('fullName')} name="name" value={editedProfile.name} isEditing={false} onChange={handleProfileChange} />
                        <EditableInfoRow label={t('tutorId')} name="tutorId" value={editedProfile.tutorId} isEditing={false} onChange={handleProfileChange} />
                        <EditableInfoRow label={t('department')} name="department" value={editedProfile.department} isEditing={isEditing} onChange={handleProfileChange} />
                        <EditableInfoRow label={t('email')} name="email" value={editedProfile.email} isEditing={isEditing} onChange={handleProfileChange} type="email" />
                        <EditableInfoRow label={t('phoneNumber')} name="phone" value={editedProfile.phone} isEditing={isEditing} onChange={handleProfileChange} type="tel" />
                    </dl>
                    {renderSaveCancelButtons()}
                </div>
                <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                    <ActionRow to="/settings" label={t('appSettings')} icon="settings" />
                </div>
             </>
         );
    };

    const renderStudentProfile = () => {
        if (!userId) return <p className="text-center text-ui-text-secondary p-10">{t('noStudentProfile')}</p>;
        if (!editedProfile) return <p className="text-center text-ui-text-secondary p-10">{t('noStudentProfile')}</p>;

        return (
            <>
                {renderProfileHeader(editedProfile, editedProfile.program)}
                <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                     <ActionRow to="/tasks" label={t('myTasks')} icon="tasks" />
                     <div className="border-t border-ui-border -mx-4 my-2"></div>
                     <ActionRow to="/request-book" label={t('requestBook')} icon="requestBook" />
                     <div className="border-t border-ui-border -mx-4 my-2"></div>
                     <ActionRow to="/settings" label={t('appSettings')} icon="settings" />
                </div>

                <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    {renderEditControls(t('academicInformation'))}
                     <dl>
                       <EditableInfoRow label={t('rollNumber')} name="rollNumber" value={editedProfile.rollNumber} isEditing={isEditing} onChange={handleProfileChange} />
                       <EditableInfoRow label={t('year')} name="year" value={editedProfile.year} isEditing={isEditing} onChange={handleProfileChange} type="number" />
                       <EditableInfoRow label={t('batch')} name="batch" value={editedProfile.batch} isEditing={isEditing} onChange={handleProfileChange} />
                       <EditableInfoRow label={t('dateOfBirth')} name="dateOfBirth" value={editedProfile.dateOfBirth} isEditing={isEditing} onChange={handleProfileChange} type="date" />
                    </dl>
                    {renderSaveCancelButtons()}
                </div>

                 <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    {renderEditControls(t('contactInformation'))}
                    <dl>
                       <EditableInfoRow label={t('fullName')} name="name" value={editedProfile.name} isEditing={isEditing} onChange={handleProfileChange} />
                       <EditableInfoRow label={t('collegeEmail')} name="collegeEmail" value={editedProfile.collegeEmail} isEditing={isEditing} onChange={handleProfileChange} type="email" />
                       <EditableInfoRow label={t('personalEmail')} name="personalEmail" value={editedProfile.personalEmail} isEditing={isEditing} onChange={handleProfileChange} type="email" />
                       <EditableInfoRow label={t('phoneNumber')} name="phone" value={editedProfile.phone} isEditing={isEditing} onChange={handleProfileChange} type="tel" />
                       <EditableInfoRow label={t('address')} name="address" value={editedProfile.address} isEditing={isEditing} onChange={handleProfileChange} area />
                    </dl>
                    {renderSaveCancelButtons()}
                </div>
            </>
        );
    };
    
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            {effectiveRole === 'Admin' && renderAdminProfile()}
            {effectiveRole === 'Tutor' && renderTutorProfile()}
            {effectiveRole === 'Student' && renderStudentProfile()}

            <div className="p-2">
                <button 
                    onClick={logout} 
                    className="w-full flex items-center justify-center p-4 rounded-xl text-ui-red bg-ui-card shadow-apple hover:bg-ui-red/10 transition-colors group"
                >
                    <Icon name="logout" className="w-6 h-6 mr-3" />
                    <span className="font-semibold text-lg">{t('logOut')}</span>
                </button>
            </div>

            {(role === 'Admin' || role === 'Tutor') && effectiveRole !== 'Student' && (
                <div className="bg-ui-card p-6 rounded-2xl shadow-apple border-l-4 border-ui-primary">
                    <h3 className="text-xl font-bold text-ui-primary border-b border-ui-border pb-3 mb-4">{t('roleActions', { role })}</h3>
                       <button onClick={switchToStudentView} className="w-full bg-ui-primary text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-80 transition-transform hover:scale-105 active:scale-100">
                            {t('switchToStudentView')}
                        </button>
                </div>
            )}
        </div>
    );
};
export default ProfilePage;