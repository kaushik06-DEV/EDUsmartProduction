

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Course, BookRequest, CourseMaterial, TutorMessage, AdminInstruction, StudentProfile, AdminProfile, TutorProfile, Hackathon, HackathonRegistration, HackathonAnnouncement, HackathonResult, Task, Notification, LeaderboardEntry, Certificate, CertificateTemplate } from '../types';
import { api } from '../services/apiService';

// Define the shape of the initial data payload from the backend (kept for reference but unused now).
interface InitialDataPayload {
  courses: Course[];
  bookRequests: BookRequest[];
  tutorMessages: TutorMessage[];
  adminInstructions: AdminInstruction[];
  studentProfiles: StudentProfile[];
  adminProfile: AdminProfile;
  tutorProfile: TutorProfile;
  hackathons: Hackathon[];
  hackathonRegistrations: HackathonRegistration[];
  tasks: Task[];
  notifications: Notification[];
  leaderboardData: LeaderboardEntry[];
  certificates: Certificate[];
  certificateTemplates: CertificateTemplate[];
}

interface DataContextType {
  loading: boolean;
  error: string | null;
  courses: Course[];
  bookRequests: BookRequest[];
  tutorMessages: TutorMessage[];
  adminInstructions: AdminInstruction[];
  studentProfiles: StudentProfile[];
  tutorProfiles: TutorProfile[];
  adminProfile: AdminProfile | null;
  tutorProfile: TutorProfile | null;
  hackathons: Hackathon[];
  hackathonRegistrations: HackathonRegistration[];
  tasks: Task[];
  notifications: Notification[];
  leaderboardData: LeaderboardEntry[];
  certificates: Certificate[];
  certificateTemplates: CertificateTemplate[];
  initializeDatabase: () => Promise<void>;
  clearDatabase: () => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  getHackathonById: (id: string) => Hackathon | undefined;
  getStudentProfileById: (id: string) => StudentProfile | undefined;
  addStudentProfile: (profile: StudentProfile) => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'industryRelevance' | 'materials'>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  addCourseMaterial: (courseId: string, material: Omit<CourseMaterial, 'id'>) => Promise<void>;
  addCourseMaterialFile: (courseId: string, params: { title: string; type: string; file: File }) => Promise<void>;
  deleteCourseMaterial: (courseId: string, materialId: string) => Promise<void>;
  updateCourse: (courseId: string, updates: Partial<Omit<Course, 'id' | 'materials'>>) => Promise<void>;
  addBookRequest: (request: Omit<BookRequest, 'id' | 'status'>) => Promise<void>;
  acceptBookRequest: (requestId: string) => Promise<void>;
  sendTutorMessage: (text: string) => Promise<void>;
  broadcastInstruction: (text: string) => Promise<void>;
  updateStudentProfile: (profile: StudentProfile) => Promise<void>;
  updateAdminProfile: (profile: AdminProfile) => Promise<void>;
  updateTutorProfile: (profile: TutorProfile) => Promise<void>;
  createHackathon: () => Promise<void>;
  updateHackathon: (details: Hackathon) => Promise<void>;
  deleteHackathon: (hackathonId: string) => Promise<void>;
  addHackathonAnnouncement: (hackathonId: string, announcementText: string) => Promise<void>;
  publishHackathonResults: (hackathonId: string, results: HackathonResult[]) => Promise<void>;
  registerForHackathon: (registration: Omit<HackathonRegistration, 'id' | 'timestamp'>) => Promise<void>;
  getRegistrationForStudent: (studentId: string, hackathonId: string) => HackathonRegistration | undefined;
  addTask: (text: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  getCertificateById: (id: string) => Certificate | undefined;
  addCertificateTemplate: (template: Omit<CertificateTemplate, 'id'>) => Promise<void>;
  updateCertificateTemplate: (template: CertificateTemplate) => Promise<void>;
  deleteCertificateTemplate: (templateId: string) => Promise<void>;
  issueCertificate: (data: { templateId: string; studentId: string; courseName: string; }) => Promise<void>;
  // Fix: Add provideCertificate to fix compilation error in CreateCertificatePage.
  provideCertificate: (data: { studentId: string; certificateName: string; className: string; department: string; imageUrl: string; }) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([]);
  const [adminInstructions, setAdminInstructions] = useState<AdminInstruction[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [tutorProfiles, setTutorProfiles] = useState<TutorProfile[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [hackathonRegistrations, setHackathonRegistrations] = useState<HackathonRegistration[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>([]);

  const normalizeCourseLevel = (value: any): number => {
    if (typeof value === 'number' && [1, 2, 3, 4].includes(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      const parsed = Number(trimmed);
      if ([1, 2, 3, 4].includes(parsed)) {
        return parsed;
      }
      const map: Record<string, number> = {
        beginner: 1,
        'first year': 1,
        intermediate: 2,
        sophomore: 2,
        advanced: 3,
        junior: 3,
        senior: 4,
        expert: 4,
      };
      if (map[trimmed] !== undefined) {
        return map[trimmed];
      }
    }
    return 1;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const users = await api.get<any[]>('/users');
        const mappedStudents: StudentProfile[] = (users || []).filter(u => u.role === 'student').map(u => ({
          id: u._id || u.id,
          name: u.name || 'Student',
          rollNumber: u.rollNumber || '',
          dateOfBirth: '',
          password: '',
          program: 'General',
          year: 1,
          phone: u.profile?.phone || '',
          collegeEmail: u.email || '',
          personalEmail: '',
          address: u.profile?.location || '',
          batch: '',
          photoUrl: u.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${u._id || u.id}`,
        }));
        setStudentProfiles(mappedStudents);

        const mappedTutors: TutorProfile[] = (users || []).filter(u => u.role === 'tutor').map(u => ({
          id: u._id || u.id,
          name: u.name || 'Tutor',
          email: u.email || '',
          department: u.profile?.department || 'General',
          photoUrl: u.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${u._id || u.id}`,
          tutorId: u.tutorId || u.staffId || u.employeeId || (u._id || u.id),
          phone: u.profile?.phone || '',
        }));
        setTutorProfiles(mappedTutors);

        const serverCourses = await api.get<any[]>('/courses');
        const mappedCourses: Course[] = (serverCourses || []).map((c: any) => ({
          id: c._id || c.id,
          name: c.title || c.name || 'Untitled Course',
          code: c.code || '',
          description: c.description || '',
          programId: (c.programId as any) || 'cs_traditional',
          level: normalizeCourseLevel(c.level),
          industryRelevance: 0,
          materials: Array.isArray(c.materials) ? c.materials : [],
        }));
        setCourses(mappedCourses);

        const serverHacks = await api.get<any[]>('/hackathons');
        const mappedHacks: Hackathon[] = (serverHacks || []).map((h: any) => ({
          id: h._id || h.id,
          title: h.title || '',
          theme: h.theme || '',
          description: h.description || '',
          startDate: h.startDate ? new Date(h.startDate).toISOString() : new Date().toISOString(),
          endDate: h.endDate ? new Date(h.endDate).toISOString() : new Date().toISOString(),
          rules: Array.isArray(h.rules) ? h.rules : [],
          prizes: Array.isArray(h.prizes) ? h.prizes : [],
          resources: Array.isArray(h.resources) ? h.resources : [],
          announcements: Array.isArray(h.announcements) ? h.announcements : [],
          results: Array.isArray(h.results) ? h.results : [],
        }));
        setHackathons(mappedHacks);

        const serverCerts = await api.get<any[]>('/certificates');
        setCertificates(serverCerts as any);

        let uid: string | null = null;
        try { uid = localStorage.getItem('userId'); } catch {}
        if (uid) {
          const serverNotifs = await api.get<any[]>(`/notifications?user=${uid}`);
          setNotifications(serverNotifs as any);
        } else {
          setNotifications([]);
        }

        setTutorMessages([]);
        setAdminInstructions([]);
        setAdminProfile(null);
        setTutorProfile(null);
        setHackathonRegistrations([]);
        setTasks([]);
        setLeaderboardData([]);
        setCertificateTemplates([]);

      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const initializeDatabase = async () => {
    alert("Initialization disabled: app now uses live backend data.");
  };

  const clearDatabase = async () => {
    alert("Clear disabled: manage data via backend or database directly.");
  };
  
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  const getHackathonById = (id: string) => hackathons.find(h => (h as any).id === id);
  const getStudentProfileById = (id: string) => studentProfiles.find(p => p.id === id);
  const getRegistrationForStudent = (studentId: string, hackathonId: string) => hackathonRegistrations.find(reg => reg.studentId === studentId && reg.hackathonId === hackathonId);
  const getCertificateById = (id: string) => certificates.find((c: any) => c._id === id || c.id === id) as any;

  const addStudentProfile = async (profile: StudentProfile) => {
    setStudentProfiles(prev => {
      const exists = prev.some(p => p.id === profile.id);
      return exists ? prev : [...prev, profile];
    });
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'industryRelevance' | 'materials'>) => {
    let createdBy: string | null = null;
    try { createdBy = localStorage.getItem('userId'); } catch {}
    if (!createdBy) {
      throw new Error('You must be logged in to create a course.');
    }
    const payload: any = {
      title: (courseData as any).name,
      description: courseData.description,
      level: normalizeCourseLevel(courseData.level),
      code: (courseData as any).code,
      programId: (courseData as any).programId,
      createdBy,
    };
    const created = await api.post<any>('/courses', payload);
    const mapped: Course = {
      id: created._id || created.id,
      name: created.title || 'Untitled Course',
      code: created.code || '',
      description: created.description || '',
      programId: (created.programId as any) || 'cs_traditional',
      level: normalizeCourseLevel(created.level),
      industryRelevance: 0,
      materials: Array.isArray(created.materials) ? created.materials : [],
    };
    setCourses(prev => [mapped, ...prev]);
  };

  const deleteCourse = async (courseId: string) => {
    await api.delete(`/courses/${courseId}`);
    setCourses(prev => prev.filter((c: any) => c.id !== courseId));
  };

  const updateCourse = async (courseId: string, updates: Partial<Omit<Course, 'id' | 'materials'>>) => {
    const payload: any = {
      title: (updates as any).name,
      name: (updates as any).name,
      code: updates.code,
      description: updates.description,
      programId: updates.programId,
      level: updates.level,
    };
    const cleaned: Record<string, any> = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleaned[key] = value;
      }
    });

    const updated = await api.put<any>(`/courses/${courseId}`, cleaned);
    const mapped: Course = {
      id: updated._id || updated.id,
      name: updated.title || updated.name || 'Untitled Course',
      code: updated.code || '',
      description: updated.description || '',
      programId: (updated.programId as any) || 'cs_traditional',
      level: normalizeCourseLevel(updated.level),
      industryRelevance: 0,
      materials: Array.isArray(updated.materials) ? updated.materials : [],
    };
    setCourses(prev => prev.map(c => c.id === courseId ? mapped : c));
  };
  
  const addCourseMaterial = async (courseId: string, materialData: Omit<CourseMaterial, 'id'>) => {
    const updated = await api.post<any>(`/courses/${courseId}/materials`, {
      title: (materialData as any).title,
      type: (materialData as any).type,
      url: (materialData as any).url,
    });
    const mapped: Course = {
      id: updated._id || updated.id,
      name: updated.title || 'Untitled Course',
      code: updated.code || '',
      description: updated.description || '',
      programId: (updated.programId as any) || 'cs_traditional',
      level: normalizeCourseLevel(updated.level),
      industryRelevance: 0,
      materials: Array.isArray(updated.materials) ? updated.materials : [],
    };
    setCourses(prev => prev.map(c => c.id === courseId ? mapped : c));
  };

  const addCourseMaterialFile = async (courseId: string, params: { title: string; type: string; file: File }) => {
    const form = new FormData();
    form.append('title', params.title);
    form.append('type', params.type);
    form.append('file', params.file);
    // Use raw fetch because apiService JSON-encodes bodies by default
    const token = (() => { try { return localStorage.getItem('authToken'); } catch { return null; } })();
    const res = await fetch(`${(import.meta as any).env?.VITE_API_URL || (process as any).env?.REACT_APP_API_URL || 'http://localhost:3001/api'}/courses/${courseId}/materials/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } as any : undefined,
      body: form,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({} as any));
      throw new Error(body.error || 'Upload failed');
    }
    const updated = await res.json();
    const mapped: Course = {
      id: updated._id || updated.id,
      name: updated.title || 'Untitled Course',
      code: updated.code || '',
      description: updated.description || '',
      programId: (updated.programId as any) || 'cs_traditional',
      level: ((updated.level === 'beginner' ? 1 : updated.level === 'intermediate' ? 2 : updated.level === 'advanced' ? 3 : 1) as number),
      industryRelevance: 0,
      materials: Array.isArray(updated.materials) ? updated.materials : [],
    };
    setCourses(prev => prev.map(c => c.id === courseId ? mapped : c));
  };

  const deleteCourseMaterial = async (courseId: string, materialId: string) => {
    try {
      const token = (() => { try { return localStorage.getItem('authToken'); } catch { return null; } })();
      const res = await fetch(`${(import.meta as any).env?.VITE_API_URL || (process as any).env?.REACT_APP_API_URL || 'http://localhost:3001/api'}/courses/${courseId}/materials/${materialId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } as any : undefined,
      });
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any));
        throw new Error(body.error || 'Failed to delete material');
      }
      
      // Update the local state to remove the deleted material
      setCourses(prev => prev.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            materials: course.materials?.filter((m: any) => m._id !== materialId && m.id !== materialId) || []
          };
        }
        return course;
      }));
      
    } catch (error: any) {
      console.error('Error deleting material:', error);
      throw error;
    }
  };

  const addBookRequest = async (requestData: Omit<BookRequest, 'id' | 'status'>) => {
    const created = await api.post<any>('/book-requests', requestData as any);
    setBookRequests(prev => [created as any, ...prev]);
  }

  const acceptBookRequest = async (requestId: string) => {
    const updated = await api.put<any>(`/book-requests/${requestId}`, { status: 'Approved' });
    setBookRequests(prev => prev.map((r: any) => (r._id === requestId || r.id === requestId) ? updated : r));
  }

  const sendTutorMessage = async (text: string) => {
    const newMessage: TutorMessage = { id: `tm-${Date.now()}`, text, timestamp: Date.now() } as any;
    setTutorMessages(prev => [...prev, newMessage]);
  }

  const broadcastInstruction = async (text: string) => {
    const newInstruction: AdminInstruction = { id: `ai-${Date.now()}`, text, timestamp: Date.now() } as any;
    setAdminInstructions(prev => [newInstruction, ...prev]);
  }
  
  const updateStudentProfile = async (profile: StudentProfile) => {
    setStudentProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  };

  const updateAdminProfile = async (profile: AdminProfile) => {
    setAdminProfile(profile);
  };

  const updateTutorProfile = async (profile: TutorProfile) => {
    setTutorProfile(profile);
  };

  const createHackathon = async () => {
    const created = await api.post<any>('/hackathons', { title: 'New Hackathon', startDate: new Date(), endDate: new Date(Date.now() + 86400000) });
    // Normalize immediately
    const mapped: Hackathon = {
      id: created._id || created.id,
      title: created.title || '',
      theme: created.theme || '',
      description: created.description || '',
      startDate: created.startDate ? new Date(created.startDate).toISOString() : new Date().toISOString(),
      endDate: created.endDate ? new Date(created.endDate).toISOString() : new Date().toISOString(),
      rules: Array.isArray(created.rules) ? created.rules : [],
      prizes: Array.isArray(created.prizes) ? created.prizes : [],
      resources: Array.isArray(created.resources) ? created.resources : [],
      announcements: Array.isArray(created.announcements) ? created.announcements : [],
      results: Array.isArray(created.results) ? created.results : [],
    };
    setHackathons(prev => [mapped, ...prev]);
  };

  const updateHackathon = async (details: Hackathon) => {
    const id = (details as any).id;
    const payload = {
      title: details.title,
      theme: (details as any).theme,
      description: details.description,
      startDate: details.startDate,
      endDate: details.endDate,
      rules: (details as any).rules || [],
      prizes: (details as any).prizes || [],
      resources: (details as any).resources || [],
    };
    const updated = await api.put<any>(`/hackathons/${id}`, payload);
    const mapped: Hackathon = {
      id: updated._id || updated.id,
      title: updated.title || '',
      theme: updated.theme || '',
      description: updated.description || '',
      startDate: updated.startDate ? new Date(updated.startDate).toISOString() : new Date().toISOString(),
      endDate: updated.endDate ? new Date(updated.endDate).toISOString() : new Date().toISOString(),
      rules: Array.isArray(updated.rules) ? updated.rules : [],
      prizes: Array.isArray(updated.prizes) ? updated.prizes : [],
      resources: Array.isArray(updated.resources) ? updated.resources : [],
      announcements: Array.isArray(updated.announcements) ? updated.announcements : [],
      results: Array.isArray(updated.results) ? updated.results : [],
    };
    setHackathons(prev => prev.map((h: any) => (h.id === id ? mapped : h)));
  }

  const deleteHackathon = async (hackathonId: string) => {
    await api.delete(`/hackathons/${hackathonId}`);
    setHackathons(prev => prev.filter((h: any) => (h.id) !== hackathonId));
  };

  const addHackathonAnnouncement = async (hackathonId: string, announcementText: string) => {
    const newAnnouncement: HackathonAnnouncement = { id: `ann-${Date.now()}`, text: announcementText, timestamp: Date.now() } as any;
    setHackathons(prev => prev.map((h: any) => ((h.id) === hackathonId ? { ...h, announcements: [newAnnouncement, ...(h.announcements || [])] } : h)));
  };

  const publishHackathonResults = async (hackathonId: string, results: HackathonResult[]) => {
    const resultsWithIds = results.map((r, i) => ({...r, id: `res-${Date.now()}-${i}`})) as any;
    setHackathons(prev => prev.map((h: any) => ((h.id) === hackathonId ? { ...h, results: resultsWithIds } : h)));
  };

  const registerForHackathon = async (registrationData: Omit<HackathonRegistration, 'id' | 'timestamp'>) => {
    const newRegistration: HackathonRegistration = { ...registrationData, id: `reg-${Date.now()}`, timestamp: Date.now() } as any;
    setHackathonRegistrations(prev => [...prev, newRegistration]);
  };

  const addTask = async (text: string) => {
    const newTask: Task = { id: `task-${Date.now()}`, text, completed: false } as any;
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = async (task: Task) => {
    setTasks(prev => prev.map(t => (t as any).id === (task as any).id ? task : t));
  };

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter((t: any) => t.id !== taskId));
  };

  // --- Certificate Functions ---
  const addCertificateTemplate = async (_templateData: Omit<CertificateTemplate, 'id'>) => {
    // Not backed yet
  };

  const updateCertificateTemplate = async (_template: CertificateTemplate) => {
    // Not backed yet
  };

  const deleteCertificateTemplate = async (_templateId: string) => {
    // Not backed yet
  };

  const issueCertificate = async (_data: { templateId: string; studentId: string; courseName: string; }) => {
    // Not backed yet
  };

  const provideCertificate = async (_data: { studentId: string; certificateName: string; className: string; department: string; imageUrl: string; }) => {
    // Not backed yet
  };

  const value = { 
    loading, error,
    courses, bookRequests, tutorMessages, adminInstructions, studentProfiles, tutorProfiles,
    adminProfile, tutorProfile, hackathons, hackathonRegistrations, tasks,
    notifications,
    leaderboardData,
    certificates,
    certificateTemplates,
    initializeDatabase, clearDatabase, getCourseById, getHackathonById, getStudentProfileById, addStudentProfile, addCourse, 
    deleteCourse, updateCourse, addCourseMaterial, addCourseMaterialFile, deleteCourseMaterial, addBookRequest, acceptBookRequest, 
    sendTutorMessage, broadcastInstruction, updateStudentProfile,
    updateAdminProfile, updateTutorProfile, createHackathon, updateHackathon,
    deleteHackathon, addHackathonAnnouncement, publishHackathonResults,
    registerForHackathon, getRegistrationForStudent,
    addTask, updateTask, deleteTask,
    markNotificationAsRead: (_id: string) => {},
    markAllNotificationsAsRead: () => {},
    deleteNotification: (_id: string) => {},
    getCertificateById,
    addCertificateTemplate,
    updateCertificateTemplate,
    deleteCertificateTemplate,
    issueCertificate,
    provideCertificate
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
