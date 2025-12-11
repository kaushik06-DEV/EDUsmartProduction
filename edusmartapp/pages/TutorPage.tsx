



import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Course, MaterialType, ProgramId, Hackathon } from '../types';
import { PROGRAMS } from '../constants';
import { useLanguage } from '../i18n/index';
import Icon from '../components/Icon';
import ConfirmationModal from '../components/ConfirmationModal';

const TutorPage: React.FC = () => {
  const { 
      courses,
      deleteCourse, 
      bookRequests, 
      acceptBookRequest, 
      addCourse, 
      updateCourse,
      addCourseMaterial, 
      addCourseMaterialFile,
      deleteCourseMaterial,
      adminInstructions, 
      sendTutorMessage,
      hackathons,
      hackathonRegistrations,
      updateHackathon,
      deleteHackathon
  } = useData();
  const { t } = useLanguage();
  
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [programId, setProgramId] = useState<ProgramId>(ProgramId.CS_TRADITIONAL);
  const [courseLevel, setCourseLevel] = useState(1);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  const [selectedCourseId, setSelectedCourseId] = useState(courses.length > 0 ? courses[0].id : '');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>(MaterialType.PDF);
  
  const [tutorMessage, setTutorMessage] = useState('');
  
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [editableHackathon, setEditableHackathon] = useState<Hackathon | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; name: string } | null>(null);
  
  const [syncDate, setSyncDate] = useState(new Date().toISOString().split('T')[0]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const currentHackathon = hackathons.find(h => h.id === selectedHackathonId);
    setEditableHackathon(currentHackathon || null);
  }, [selectedHackathonId, hackathons]);

  useEffect(() => {
    if (!courses.some(c => c.id === selectedCourseId)) {
      setSelectedCourseId(courses.length > 0 ? courses[0].id : '');
    }
  }, [courses]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const resetCourseForm = () => {
    setCourseName('');
    setCourseCode('');
    setCourseDesc('');
    setProgramId(ProgramId.CS_TRADITIONAL);
    setCourseLevel(1);
    setEditingCourseId(null);
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseCode || !courseDesc) {
      alert(t('fillAllCourseFields'));
      return;
    }
    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, {
          name: courseName,
          code: courseCode,
          description: courseDesc,
          programId,
          level: courseLevel,
        });
        alert(t('courseUpdatedSuccessfully'));
        setSelectedCourseId(editingCourseId);
      } else {
        const newCourse: Omit<Course, 'id' | 'industryRelevance' | 'materials'> = {
          name: courseName,
          code: courseCode,
          description: courseDesc,
          programId,
          level: courseLevel,
        };
        await addCourse(newCourse);
        alert(t('courseAddedSuccessfully'));
      }
      resetCourseForm();
    } catch (err: any) {
      alert(err?.message || 'Failed to save course. Please ensure you are logged in.');
    }
  };
  
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !materialTitle) {
        alert(t('selectCourseAndTitle'));
        return;
    }
    addCourseMaterial(selectedCourseId, {
        title: materialTitle,
        type: materialType,
    });
    setMaterialTitle('');
    alert(t('materialAddedSuccessfully'));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorMessage.trim()) {
      alert(t('messageCannotBeEmpty'));
      return;
    }
    sendTutorMessage(tutorMessage);
    setTutorMessage('');
    alert(t('messageSentToAdmin'));
  };

  const promptDeleteCourse = (courseId: string, courseName:string) => {
    setCourseToDelete({ id: courseId, name: courseName });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
        deleteCourse(courseToDelete.id);
        alert(t('courseDeletedSuccessfully'));
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
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
  
  const handleDeleteHackathon = (hackathonId: string) => {
    if(window.confirm(t('deleteHackathonConfirmation'))) {
        deleteHackathon(hackathonId);
        alert(t('hackathonDeleted'));
        if (selectedHackathonId === hackathonId) {
            setSelectedHackathonId(null);
        }
    }
  };

  const pendingRequests = bookRequests.filter(r => r.status === 'Pending');

  const inputStyles = "w-full p-3 border-2 border-ui-border rounded-lg bg-ui-card text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition";

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="bg-ui-card p-8 rounded-2xl shadow-apple border-l-4 border-ui-green">
        <h2 className="text-3xl font-bold text-ui-green mb-2 tracking-tight">{t('tutorDashboard')}</h2>
        <p className="text-ui-text-secondary text-lg">{t('tutorDashboardDescription')}</p>
      </div>

      {adminInstructions.length > 0 && (
        <div className="bg-ui-blue/10 border-l-4 border-ui-blue text-ui-text-primary p-6 rounded-2xl shadow-apple">
            <h3 className="font-bold text-xl mb-2">{t('latestInstructionFromAdmin')}</h3>
            <p className="text-md">{adminInstructions[0].text}</p>
            <p className="text-sm text-ui-blue mt-3">{t('postedOn')}: {new Date(adminInstructions[0].timestamp).toLocaleDateString()}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Course Management */}
          <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
            <h3 className="text-2xl font-bold text-ui-text-primary mb-6 tracking-tight">{t('courseManagement')}</h3>
            <div className="space-y-8">
                <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-ui-text-primary">{editingCourseId ? t('editCourse') : t('addCourse')}</h4>
                      {editingCourseId && (
                        <span className="text-sm text-ui-text-secondary">{t('editingCourse', { course: courseName || t('untitledCourse') })}</span>
                      )}
                    </div>
                    <form onSubmit={handleSubmitCourse} className="space-y-4 p-6 bg-ui-hover rounded-xl">
                      <input type="text" placeholder={t('courseName')} value={courseName} onChange={e => setCourseName(e.target.value)} className={inputStyles} required />
                      <input type="text" placeholder={t('courseCode')} value={courseCode} onChange={e => setCourseCode(e.target.value)} className={inputStyles} required />
                      <textarea placeholder={t('courseDescription')} value={courseDesc} onChange={e => setCourseDesc(e.target.value)} className={inputStyles} required />
                      <select value={programId} onChange={e => setProgramId(e.target.value as ProgramId)} className={inputStyles}>
                        {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <div>
                        <label htmlFor="course-level" className="block text-md font-medium text-ui-text-secondary mb-1">{t('courseLevel')}</label>
                        <select id="course-level" value={courseLevel} onChange={e => setCourseLevel(Number(e.target.value))} className={inputStyles}>
                            <option value={1}>{t('yearLevel', { level: 1 })}</option>
                            <option value={2}>{t('yearLevel', { level: 2 })}</option>
                            <option value={3}>{t('yearLevel', { level: 3 })}</option>
                        </select>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button type="submit" className="flex-1 bg-ui-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80">
                          {editingCourseId ? t('updateCourse') : t('addCourse')}
                        </button>
                        {editingCourseId && (
                          <button
                            type="button"
                            onClick={resetCourseForm}
                            className="flex-1 bg-ui-red/10 text-ui-red font-bold py-3 px-4 rounded-xl hover:bg-ui-red/20"
                          >
                            {t('cancelEditing')}
                          </button>
                        )}
                      </div>
                    </form>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg text-ui-text-primary mb-3">{t('manageExistingCourses')}</h4>
                    {courses.length > 0 ? (
                      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {courses.map(course => (
                          <li key={course.id} className="flex justify-between items-center p-4 bg-ui-hover rounded-xl">
                            <div>
                               <p className="font-semibold text-ui-text-primary text-lg">{course.name}</p>
                               <p className="text-md text-ui-text-secondary">{course.code}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                  title={t('editCourse')}
                                  onClick={() => {
                                    setEditingCourseId(course.id);
                                    setCourseName(course.name);
                                    setCourseCode(course.code);
                                    setCourseDesc(course.description);
                                    setProgramId((course.programId as ProgramId) || ProgramId.CS_TRADITIONAL);
                                    setCourseLevel(course.level ?? 1);
                                  }}
                                  className="p-2 text-ui-text-secondary hover:text-ui-primary hover:bg-ui-primary/10 rounded-full transition-colors"
                                >
                                    <Icon name="edit" className="w-5 h-5" />
                                </button>
                                <button title={t('viewMaterials')} onClick={() => setSelectedCourseId(course.id)} className="p-2 text-ui-text-secondary hover:text-ui-blue hover:bg-ui-blue/10 rounded-full transition-colors">
                                    <Icon name="eye" className="w-5 h-5" />
                                </button>
                                <button onClick={() => promptDeleteCourse(course.id, course.name)} title={t('deleteCourse')} className="p-2 text-ui-text-secondary hover:text-ui-red hover:bg-ui-red/10 rounded-full transition-colors">
                                    <Icon name="trash" className="w-5 h-5" />
                                </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-md text-ui-text-secondary italic">{t('noCoursesAdded')}</p>
                    )}
                </div>
            </div>
          </div>

          <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
            <h3 className="text-2xl font-bold text-ui-text-primary mb-6 tracking-tight">{t('addCourseMaterials')}</h3>
            <form id="material-form" onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                    <label htmlFor="course-select" className="block text-md font-medium text-ui-text-secondary">{t('selectCourse')}</label>
                    <select id="course-select" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className={`${inputStyles} mt-1`} required disabled={courses.length === 0}>
                        {courses.length > 0 ? (
                            <option value="" disabled>-- {t('selectACourse')} --</option>
                        ) : (
                            <option value="" disabled>{t('addCourseFirst')}</option>
                        )}
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="material-title" className="block text-md font-medium text-ui-text-secondary">{t('materialTitle')}</label>
                    <input type="text" id="material-title" placeholder={t('materialTitlePlaceholder')} value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} className={`${inputStyles} mt-1`} required disabled={courses.length === 0} />
                </div>
                <div>
                    <label htmlFor="material-type" className="block text-md font-medium text-ui-text-secondary">{t('materialType')}</label>
                    <select id="material-type" value={materialType} onChange={e => setMaterialType(e.target.value as MaterialType)} className={`${inputStyles} mt-1`} required disabled={courses.length === 0}>
                        {Object.values(MaterialType).map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full bg-ui-green text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80" disabled={courses.length === 0}>{t('addMaterial')}</button>
            </form>

            {/* File upload */}
            <div className="mt-6 p-4 bg-ui-hover rounded-xl space-y-3">
              <h4 className="text-lg font-semibold text-ui-text-primary">{t('uploadFile')}</h4>
              <input id="file-input" type="file" className={inputStyles} disabled={courses.length === 0} />
              <button
                onClick={async () => {
                  const input = document.getElementById('file-input') as HTMLInputElement | null;
                  if (!input || !input.files || input.files.length === 0) { alert(t('selectFile')); return; }
                  if (!selectedCourseId) { alert(t('selectCourse')); return; }
                  if (!materialTitle) { alert(t('enterMaterialTitle')); return; }
                  
                  const file = input.files[0];
                  const type = file.type.includes('pdf') ? 'PDF' : file.type.includes('video') ? 'VIDEO' : 'DOC';
                  try {
                    await addCourseMaterialFile(selectedCourseId, { title: materialTitle, type, file });
                    alert(t('materialAddedSuccessfully'));
                    input.value = '';
                    setMaterialTitle(''); // Clear the title after successful upload
                  } catch (e: any) {
                    alert(e?.message || 'Upload failed');
                  }
                }}
                className="w-full bg-ui-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80"
                disabled={courses.length === 0}
              >
                {t('upload')}
              </button>
            </div>

            {/* Materials list for selected course */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-ui-text-primary mb-3">{t('materials')}</h4>
              {selectedCourse && selectedCourse.materials && selectedCourse.materials.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {selectedCourse.materials.map((m: any) => (
                    <li key={m._id || m.id} className="p-3 bg-ui-hover rounded-lg flex justify-between items-center group hover:bg-ui-hover/80 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-ui-text-primary">{m.title}</p>
                        <p className="text-sm text-ui-text-secondary">{m.type}</p>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            // Set the material title and type for editing
                            setMaterialTitle(m.title);
                            setMaterialType(m.type);
                            // Optional: Scroll to the material form
                            document.getElementById('material-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit material"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this material?')) {
                              try {
                                await deleteCourseMaterial(selectedCourseId, m._id || m.id);
                                alert('Material deleted successfully');
                              } catch (error) {
                                console.error('Error deleting material:', error);
                                alert('Failed to delete material');
                              }
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete material"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ui-text-secondary">{t('noDataAvailable')}</p>
              )}
            </div>
          </div>
          
          <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
            <h3 className="text-2xl font-bold text-ui-text-primary mb-6 tracking-tight">{t('hackathonManagement')}</h3>
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
        </div>

        <div className="lg:col-span-1 space-y-8">
            <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                <h3 className="text-xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('syncCourseMaterials')}</h3>
                <p className="text-ui-text-secondary mb-4">{t('syncDescription')}</p>
                <div className="space-y-4">
                    {/* Option 1: OAuth */}
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-ui-hover rounded-lg text-ui-primary">
                            <Icon name="google" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-ui-text-primary">{t('googleSignIn')}</h4>
                            <p className="text-sm text-ui-text-secondary">{t('googleSignInDesc')}</p>
                        </div>
                    </div>
                    {/* Option 2: Share */}
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-ui-hover rounded-lg text-ui-primary">
                            <Icon name="profile" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-ui-text-primary">{t('shareFiles')}</h4>
                            <p className="text-sm text-ui-text-secondary">
                                {t('shareFilesDesc')} <span className="font-mono bg-ui-hover p-1 rounded-md text-xs">app-service@example.com</span>
                            </p>
                        </div>
                    </div>
                    {/* Option 3: Dedicated Account */}
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-ui-hover rounded-lg text-ui-primary">
                            <Icon name="key" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-ui-text-primary">{t('dedicatedAccount')}</h4>
                            <p className="text-sm text-ui-text-secondary">{t('dedicatedAccountDesc')}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-ui-border space-y-4">
                    <div>
                        <label htmlFor="sync-date" className="block text-md font-medium text-ui-text-secondary mb-1">{t('dateAccessGranted')}</label>
                        <input 
                            type="date"
                            id="sync-date"
                            value={syncDate}
                            onChange={(e) => setSyncDate(e.target.value)}
                            className={inputStyles}
                        />
                    </div>
                    <div className="flex items-start">
                        <input 
                            id="confirm-access"
                            type="checkbox"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-ui-primary focus:ring-ui-primary mt-0.5"
                        />
                        <label htmlFor="confirm-access" className="ml-3 text-sm text-ui-text-secondary">
                            {t('confirmAccess')}
                        </label>
                    </div>
                </div>
            </div>
           <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
            <h3 className="text-xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('hackathonOverview')}</h3>
            {hackathons.length > 0 ? (
                <div className="space-y-4">
                    {hackathons.map(hackathon => (
                         <div key={hackathon.id} className="p-4 bg-ui-hover rounded-xl">
                            <p className="font-bold text-lg text-ui-primary">{hackathon.title}</p>
                            <p className="text-md text-ui-text-secondary">{hackathon.theme}</p>
                             <p className="text-sm text-ui-text-primary mt-2">{t('participatingStudents')}: <span className="font-bold">{hackathonRegistrations.filter(r => r.hackathonId === hackathon.id).length}</span></p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-ui-text-secondary">{t('noHackathonActive')}</p>
            )}
           </div>

          <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
            <h3 className="text-xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('manageBookRequests')}</h3>
            {bookRequests.length > 0 ? (
              <div>
                <h4 className="font-semibold text-yellow-700">{t('pending')} ({pendingRequests.length})</h4>
                {pendingRequests.length > 0 ? (
                  <ul className="mt-2 space-y-3">
                    {pendingRequests.map(req => (
                      <li key={req.id} className="p-4 bg-ui-yellow/10 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-md">{req.bookTitle}</p>
                        </div>
                        <button onClick={() => acceptBookRequest(req.id)} className="bg-ui-green text-white text-sm font-bold py-1.5 px-4 rounded-full hover:bg-opacity-80">{t('accept')}</button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-ui-text-secondary text-md mt-2">{t('noPendingRequests')}</p>}
              </div>
            ) : <p className="text-ui-text-secondary">{t('noBookRequests')}</p>}
          </div>

          <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
            <h3 className="text-xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('contactAdmin')}</h3>
            <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea 
                    value={tutorMessage}
                    onChange={e => setTutorMessage(e.target.value)}
                    placeholder={t('contactAdminPlaceholder')}
                    className={inputStyles} 
                    rows={4} 
                    required 
                />
                <button type="submit" className="w-full bg-ui-text-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90">{t('sendMessage')}</button>
            </form>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteCourse')}
        message={courseToDelete ? t('deleteCourseConfirmation', { courseName: courseToDelete.name }) : ''}
        confirmButtonText={t('deleteCourse')}
      />
    </div>
  );
};

export default TutorPage;
