
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';
import { useParams, Link } from 'react-router-dom';

const HackathonDetailPage: React.FC = () => {
    const { hackathonId } = useParams<{ hackathonId: string }>();
    const { getHackathonById, getRegistrationForStudent, registerForHackathon, getStudentProfileById } = useData();
    const { userId } = useAuth();
    const { t } = useLanguage();
    
    const [teamName, setTeamName] = useState('');
    
    const hackathon = hackathonId ? getHackathonById(hackathonId) : undefined;

    if (!hackathon) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-ui-text-primary">{t('hackathonNotFound')}</h2>
                <Link to="/hackathons" className="text-ui-primary hover:underline mt-4 inline-block">{t('backToHackathons')}</Link>
            </div>
        );
    }
    
    const userRegistration = userId ? getRegistrationForStudent(userId, hackathon.id) : undefined;
    
    const handleRegister = () => {
        if (!userId) return;
        if (!teamName.trim()) {
            alert(t('enterTeamName'));
            return;
        }
        if(userRegistration) {
            alert(t('alreadyRegistered'));
            return;
        }
        const studentProfile = getStudentProfileById(userId);
        if(studentProfile) {
            registerForHackathon({
                hackathonId: hackathon.id,
                studentId: userId,
                studentName: studentProfile.name,
                teamName: teamName.trim(),
            });
            setTeamName('');
            alert(t('registrationSuccessful'));
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="bg-ui-card p-8 rounded-2xl shadow-apple text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-ui-primary tracking-tight">{hackathon.title}</h2>
                <p className="text-xl text-ui-text-secondary mt-2">{hackathon.theme}</p>
                 <p className="text-md text-ui-text-primary mt-4 font-semibold">
                    {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                        <h3 className="text-2xl font-bold text-ui-text-primary mb-4">{t('description')}</h3>
                        <p className="text-ui-text-secondary text-lg">{hackathon.description}</p>
                    </div>
                     <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                        <h3 className="text-2xl font-bold text-ui-text-primary mb-4">{t('rules')}</h3>
                        <ul className="list-disc list-inside space-y-2 text-ui-text-secondary text-lg">
                           {hackathon.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                        </ul>
                    </div>
                     <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                        <h3 className="text-2xl font-bold text-ui-text-primary mb-4">{t('prizes')}</h3>
                        <ul className="list-decimal list-inside space-y-2 text-ui-text-secondary text-lg">
                             {hackathon.prizes.map((prize, i) => <li key={i}><span className="font-semibold text-ui-text-primary">{`Prize ${i+1}:`}</span> {prize}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                         <h3 className="text-2xl font-bold text-ui-text-primary mb-4">{t('registration')}</h3>
                         {userRegistration ? (
                             <div className="bg-ui-green/10 text-green-800 p-4 rounded-lg text-center">
                                 <p className="font-bold text-lg">{t('yourStatus')}: {t('registered')}</p>
                                 <p className="mt-1">{t('teamName')}: <span className="font-semibold">{userRegistration.teamName}</span></p>
                             </div>
                         ) : (
                             <div className="space-y-4">
                                 <input 
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder={t('teamName')}
                                    className="w-full p-3 border-2 border-ui-border rounded-lg bg-ui-card text-ui-text-primary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary"
                                 />
                                 <button onClick={handleRegister} className="w-full bg-ui-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-80">
                                     {t('register')}
                                 </button>
                             </div>
                         )}
                    </div>
                    <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                        <h3 className="text-2xl font-bold text-ui-text-primary mb-4">{t('announcements')}</h3>
                        <div className="space-y-4 max-h-72 overflow-y-auto">
                            {hackathon.announcements.length > 0 ? [...hackathon.announcements].sort((a,b) => b.timestamp - a.timestamp).map(ann => (
                                <div key={ann.id} className="p-3 bg-ui-hover rounded-lg">
                                    <p className="text-ui-text-primary">{ann.text}</p>
                                    <p className="text-xs text-ui-text-secondary text-right mt-1">{formatDate(new Date(ann.timestamp).toISOString())}</p>
                                </div>
                            )) : <p className="text-ui-text-secondary">{t('noAnnouncements')}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {hackathon.results.length > 0 && (
                 <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
                    <h3 className="text-2xl font-bold text-ui-text-primary mb-4 text-center">{t('leaderboard')}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-ui-border">
                                    <th className="p-3 text-lg font-semibold text-ui-text-primary">Rank</th>
                                    <th className="p-3 text-lg font-semibold text-ui-text-primary">Team Name</th>
                                    <th className="p-3 text-lg font-semibold text-ui-text-primary">Prize</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hackathon.results.map(res => (
                                    <tr key={res.id} className="border-b border-ui-hover last:border-b-0">
                                        <td className="p-3 text-lg font-bold text-ui-primary">{res.rank}</td>
                                        <td className="p-3 text-lg text-ui-text-secondary">{res.teamName}</td>
                                        <td className="p-3 text-lg text-ui-text-secondary">{res.prize}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HackathonDetailPage;
