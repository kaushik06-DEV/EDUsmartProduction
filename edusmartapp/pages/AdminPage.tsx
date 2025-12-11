import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n/index';
import Icon from '../components/Icon';
import { Hackathon, HackathonResult } from '../types';

const AdminPage: React.FC = () => {
  const { 
    courses, 
    deleteCourse, 
    bookRequests, 
    tutorMessages, 
    broadcastInstruction, 
    hackathons,
    createHackathon, 
    updateHackathon,
    deleteHackathon, 
    hackathonRegistrations,
    addHackathonAnnouncement,
    publishHackathonResults,
    initializeDatabase,
    clearDatabase,
    studentProfiles,
    tutorProfiles
  } = useData();
  const { t } = useLanguage();
  const [instruction, setInstruction] = useState('');
  
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [editableHackathon, setEditableHackathon] = useState<Hackathon | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [resultsText, setResultsText] = useState('');
  
  useEffect(() => {
    const currentHackathon = hackathons.find(h => h.id === selectedHackathonId);
    setEditableHackathon(currentHackathon || null);
    if(currentHackathon && currentHackathon.results.length > 0) {
      setResultsText(JSON.stringify(currentHackathon.results, null, 2));
    } else {
      setResultsText('');
    }
  }, [selectedHackathonId, hackathons]);
  
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) {
      alert(t('instructionCannotBeEmpty'));
      return;
    }
    broadcastInstruction(instruction);
    setInstruction('');
    alert(t('instructionBroadcasted'));
  };

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    if (window.confirm(t('deleteCourseConfirmation', { courseName }))) {
        deleteCourse(courseId);
        alert(t('courseDeletedSuccessfully'));
    }
  };

  const handleHackathonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editableHackathon) return;
    const { name, value } = e.target;
    if (name === 'rules' || name === 'prizes') {
        setEditableHackathon({ ...editableHackathon, [name]: value.split('\n') });
    } else {
        setEditableHackathon({ ...editableHackathon, [name]: value });
    }
  };

  const handleSaveHackathon = () => {
    if (editableHackathon) {
        updateHackathon(editableHackathon);
        alert(t('hackathonDetailsUpdated'));
    }
  };
  
  const handlePostAnnouncement = () => {
      if(!newAnnouncement.trim() || !selectedHackathonId) return;
      addHackathonAnnouncement(selectedHackathonId, newAnnouncement);
      setNewAnnouncement('');
      alert(t('announcementPosted'));
  };
  
  const handlePublishResults = () => {
      if (!selectedHackathonId) return;
      try {
          const results: HackathonResult[] = JSON.parse(resultsText);
          if(Array.isArray(results) && results.every(r => 'rank' in r && 'teamName' in r && 'prize' in r)) {
              publishHackathonResults(selectedHackathonId, results);
              alert(t('resultsPublished'));
          } else {
              throw new Error('Invalid JSON structure');
          }
      } catch (error) {
          alert(t('invalidResultsJson'));
      }
  };

  const handleCreateHackathon = () => {
    createHackathon();
    alert(t('hackathonCreated'));
  };

  const handleDeleteHackathon = (hackathonId: string) => {
    if(window.confirm(t('deleteHackathonConfirmation'))) {
        deleteHackathon(hackathonId);
        alert(t('hackathonDeleted'));
        if (selectedHackathonId === hackathonId) {
            setSelectedHackathonId(null);
        }
    }
  };

  const inputStyles = "w-full p-3 border-2 border-ui-border rounded-lg bg-ui-card text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition";

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="bg-ui-card p-8 rounded-2xl shadow-apple border-l-4 border-ui-red">
        <h2 className="text-3xl font-bold text-ui-red mb-4 tracking-tight">{t('adminCoordinatorDashboard')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-ui-blue/10 p-5 rounded-xl">
                <p className="text-md text-ui-blue font-semibold">{t('totalStudents')}</p>
                <p className="text-4xl font-bold text-ui-text-primary mt-1">{studentProfiles.length}</p>
            </div>
            <div className="bg-ui-green/10 p-5 rounded-xl">
                <p className="text-md text-ui-green font-semibold">{t('totalTutors')}</p>
                <p className="text-4xl font-bold text-ui-text-primary mt-1">{tutorProfiles.length}</p>
            </div>
            <div className="bg-purple-500/10 p-5 rounded-xl">
                <p className="text-md text-purple-700 font-semibold">{t('totalCourses')}</p>
                <p className="text-4xl font-bold text-ui-text-primary mt-1">{courses.length}</p>
            </div>
        </div>
      </div>

       <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-ui-text-primary tracking-tight">{t('hackathonManagement')}</h3>
            <button onClick={handleCreateHackathon} className="bg-ui-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-80 transition">{t('createHackathon')}</button>
        </div>
        
        {hackathons.length > 0 ? (
            <div className="space-y-4">
                {hackathons.map(hack => (
                    <div key={hack.id} className="border border-ui-border rounded-xl">
                        <button onClick={() => setSelectedHackathonId(prevId => prevId === hack.id ? null : hack.id)} className="w-full flex justify-between items-center p-4 text-left">
                            <span className="font-semibold text-lg">{hack.title}</span>
                            <Icon name={selectedHackathonId === hack.id ? "trash" : "edit"} className="w-5 h-5" />
                        </button>
                        
                        {selectedHackathonId === hack.id && editableHackathon && (
                            <div className="p-4 border-t border-ui-border space-y-6">
                                {/* Event Details */}
                                <div className="bg-ui-hover p-6 rounded-xl">
                                    <h4 className="text-xl font-semibold mb-3">{t('eventDetails')}</h4>
                                    <div className="space-y-4">
                                        <input name="title" value={editableHackathon.title} onChange={handleHackathonChange} placeholder={t('title')} className={inputStyles} />
                                        <input name="theme" value={editableHackathon.theme} onChange={handleHackathonChange} placeholder={t('theme')} className={inputStyles} />
                                        <textarea name="description" value={editableHackathon.description} onChange={handleHackathonChange} placeholder={t('description')} className={inputStyles} rows={3} />
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input type="datetime-local" name="startDate" value={editableHackathon.startDate} onChange={handleHackathonChange} className={inputStyles} />
                                            <input type="datetime-local" name="endDate" value={editableHackathon.endDate} onChange={handleHackathonChange} className={inputStyles} />
                                        </div>
                                        <textarea name="rules" value={editableHackathon.rules.join('\n')} onChange={handleHackathonChange} placeholder={t('rules')} className={inputStyles} rows={4} />
                                        <textarea name="prizes" value={editableHackathon.prizes.join('\n')} onChange={handleHackathonChange} placeholder={t('prizes')} className={inputStyles} rows={3} />
                                        <button onClick={handleSaveHackathon} className="w-full bg-ui-primary text-white font-bold py-3 rounded-lg">{t('saveHackathonDetails')}</button>
                                    </div>
                                </div>
                                {/* Registrations */}
                                <div className="bg-ui-hover p-6 rounded-xl">
                                    <h4 className="text-xl font-semibold mb-3">{t('registrations')} ({hackathonRegistrations.filter(r => r.hackathonId === hack.id).length})</h4>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {hackathonRegistrations.filter(r => r.hackathonId === hack.id).map(reg => (
                                            <div key={reg.id} className="bg-white p-3 rounded-lg">
                                                <p className="font-semibold">{reg.teamName}</p>
                                                <p className="text-sm text-ui-text-secondary">{reg.studentName} ({reg.studentId})</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                 {/* Announcements */}
                                <div className="bg-ui-hover p-6 rounded-xl">
                                     <h4 className="text-xl font-semibold mb-3">{t('announcements')}</h4>
                                     <div className="flex gap-3">
                                        <input value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} placeholder={t('newAnnouncement')} className={inputStyles} />
                                        <button onClick={handlePostAnnouncement} className="bg-ui-green text-white font-semibold px-6 rounded-lg">{t('post')}</button>
                                     </div>
                                </div>
                                 {/* Results */}
                                <div className="bg-ui-hover p-6 rounded-xl">
                                    <h4 className="text-xl font-semibold mb-3">{t('results')}</h4>
                                    <textarea value={resultsText} onChange={(e) => setResultsText(e.target.value)} placeholder={t('resultsJsonPlaceholder')} className={`${inputStyles} font-mono`} rows={8} />
                                    <button onClick={handlePublishResults} className="w-full mt-3 bg-ui-blue text-white font-bold py-3 rounded-lg">{t('publishResults')}</button>
                                </div>
                                {/* Delete */}
                                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                                    <h4 className="text-xl font-semibold mb-3 text-ui-red">{t('dangerZone')}</h4>
                                    <button onClick={() => handleDeleteHackathon(hack.id)} className="w-full bg-ui-red text-white font-bold py-3 rounded-lg">{t('deleteHackathon')}</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-ui-text-secondary py-8">{t('noHackathonActive')}</p>
        )}
      </div>
      
      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h3 className="text-2xl font-bold text-ui-text-primary mb-2 tracking-tight">{t('databaseManagement')}</h3>
        <p className="text-md text-ui-text-secondary mb-6">{t('databaseManagementDescription')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={initializeDatabase}
              className="bg-ui-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80 transition-colors"
            >
              {t('initializeDatabase')}
            </button>
            <button 
              onClick={clearDatabase}
              className="bg-ui-red text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80 transition-colors"
            >
              {t('clearDatabase')}
            </button>
        </div>
      </div>

      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h3 className="text-2xl font-bold text-ui-text-primary mb-2 tracking-tight">{t('broadcastInstructions')}</h3>
        <p className="text-md text-ui-text-secondary mb-4">{t('broadcastDescription')}</p>
        <form onSubmit={handleBroadcast} className="flex flex-col sm:flex-row gap-3">
            <textarea 
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={t('enterInstruction')}
              className="flex-1 p-3 border-2 border-ui-border rounded-xl bg-ui-card text-ui-text-primary placeholder-ui-text-secondary focus:ring-2 focus:ring-ui-primary focus:border-ui-primary focus:outline-none transition"
              rows={2}
              required
            />
            <button type="submit" className="bg-ui-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-80">{t('broadcast')}</button>
        </form>
      </div>

      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h3 className="text-2xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('messagesFromTutors')}</h3>
        {tutorMessages.length > 0 ? (
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {tutorMessages.map(msg => (
              <div key={msg.id} className="p-4 bg-ui-hover rounded-xl">
                <p className="text-ui-text-primary text-md">{msg.text}</p>
                <p className="text-sm text-ui-text-secondary mt-2 text-right">{new Date(msg.timestamp).toLocaleString()}</p>
              </div>
            )).reverse()}
          </div>
        ) : (
          <p className="text-ui-text-secondary">{t('noTutorMessages')}</p>
        )}
      </div>

       <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h3 className="text-2xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('courseManagement')}</h3>
         {courses.length > 0 ? (
            <ul className="space-y-3 max-h-96 overflow-y-auto">
                {courses.map(course => (
                    <li key={course.id} className="flex justify-between items-center p-4 bg-ui-hover rounded-xl">
                      <div>
                         <p className="font-semibold text-ui-text-primary text-lg">{course.name}</p>
                         <p className="text-md text-ui-text-secondary">{course.code}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                          <button onClick={() => handleDeleteCourse(course.id, course.name)} title={t('deleteCourse')} className="p-2 text-ui-text-secondary hover:text-ui-red hover:bg-ui-red/10 rounded-full transition-colors">
                              <Icon name="trash" className="w-5 h-5" />
                          </button>
                      </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-ui-text-secondary">{t('noCoursesAdded')}</p>
        )}
      </div>

      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h3 className="text-2xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('bookRequestOverview')}</h3>
        {bookRequests.length > 0 ? (
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {[...bookRequests].reverse().map(req => (
              <div key={req.id} className="p-4 bg-ui-hover rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-ui-text-primary text-lg">{req.bookTitle}</p>
                  <p className="text-md text-ui-text-secondary">{t('for')}: {req.courseName}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${req.status === 'Accepted' ? 'bg-ui-green/20 text-green-800' : 'bg-ui-yellow/20 text-yellow-800'}`}>
                  {t(req.status.toLowerCase())}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ui-text-secondary">{t('noBookRequests')}</p>
        )}
      </div>

    </div>
  );
};

export default AdminPage;