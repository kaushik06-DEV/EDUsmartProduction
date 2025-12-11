
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserRole, StudentProfile } from '../types';
import { DEFAULT_TUTOR_PROFILE } from '../constants';
import { useData } from './DataContext';
import * as authApi from '../services/authService';

const STUDENT_LOGIN_COUNT_KEY = 'studentLoginCount';
const TUTOR_LOGIN_COUNT_KEY = 'tutorLoginCount';

interface AuthContextType {
  role: UserRole | null;
  userId: string | null;
  effectiveRole: UserRole | null;
  studentLoginCount: number;
  tutorLoginCount: number;
  login: (role: UserRole, identifier: string, credential?: string) => Promise<void>;
  register: (profileData: Omit<StudentProfile, 'id' | 'photoUrl'>) => Promise<void>;
  logout: () => void;
  switchToStudentView: () => void;
  switchToAdminView: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isStudentView, setIsStudentView] = useState<boolean>(false);
  const [studentLoginCount, setStudentLoginCount] = useState<number>(0);
  const [tutorLoginCount, setTutorLoginCount] = useState<number>(0);
  const data = useData();

  useEffect(() => {
    try {
        const token = localStorage.getItem('authToken');
        if (token) {
            const storedRole = localStorage.getItem('userRole') as UserRole | null;
            const storedUserId = localStorage.getItem('userId');
            if (storedRole && storedUserId) {
                setRole(storedRole);
                setUserId(storedUserId);
            }
        }
      
        const storedStudentCount = localStorage.getItem(STUDENT_LOGIN_COUNT_KEY);
        setStudentLoginCount(storedStudentCount ? parseInt(storedStudentCount, 10) : 0);
        const storedTutorCount = localStorage.getItem(TUTOR_LOGIN_COUNT_KEY);
        setTutorLoginCount(storedTutorCount ? parseInt(storedTutorCount, 10) : 0);
    } catch (error) {
        console.error("Could not read from localStorage", error);
    }
  }, []);
  
  const login = async (loginRole: UserRole, identifier: string, credential?: string) => {
    const resp = await authApi.login(identifier, credential || '');
    localStorage.setItem('authToken', resp.token);
    const mappedRole: UserRole = resp.user.role === 'student' ? 'Student' : resp.user.role === 'tutor' ? 'Tutor' : 'Admin';
    localStorage.setItem('userRole', mappedRole);
    localStorage.setItem('userId', resp.user.id);
    setRole(mappedRole);
    setUserId(resp.user.id);

    // update counts for analytics UX
    if (mappedRole === 'Student') {
      const newStudentCount = studentLoginCount + 1;
      localStorage.setItem(STUDENT_LOGIN_COUNT_KEY, newStudentCount.toString());
      setStudentLoginCount(newStudentCount);
    } else if (mappedRole === 'Tutor') {
      const newTutorCount = tutorLoginCount + 1;
      localStorage.setItem(TUTOR_LOGIN_COUNT_KEY, newTutorCount.toString());
      setTutorLoginCount(newTutorCount);
    }

    // Ensure DataContext has a StudentProfile for pages relying on it
    if (mappedRole === 'Student') {
      const existing = data.getStudentProfileById(resp.user.id);
      if (!existing) {
        await data.addStudentProfile({
          id: resp.user.id,
          name: resp.user.name || 'Student',
          rollNumber: resp.user.rollNumber || 'unknown',
          dateOfBirth: '',
          password: '',
          program: 'General',
          year: 1,
          phone: '',
          collegeEmail: resp.user.email || '',
          personalEmail: '',
          address: '',
          batch: '',
          photoUrl: `https://i.pravatar.cc/150?u=${resp.user.id}`
        });
      }
    }
  };

  const register = async (profileData: Omit<StudentProfile, 'id' | 'photoUrl'>) => {
    const resp = await authApi.registerStudent({ name: profileData.name, password: profileData.password, rollNumber: profileData.rollNumber, email: profileData.collegeEmail });
    localStorage.setItem('authToken', resp.token);
    localStorage.setItem('userRole', 'Student');
    localStorage.setItem('userId', resp.user.id);
    setRole('Student');
    setUserId(resp.user.id);

    // Seed DataContext with a StudentProfile so UI pages can render immediately
    await data.addStudentProfile({
      id: resp.user.id,
      name: profileData.name,
      rollNumber: profileData.rollNumber,
      dateOfBirth: profileData.dateOfBirth,
      password: profileData.password,
      program: profileData.program,
      year: profileData.year,
      phone: '',
      collegeEmail: `${profileData.rollNumber}@kahedu.edu`,
      personalEmail: '',
      address: '',
      batch: `${new Date().getFullYear() - Number(profileData.year) + 1}-${new Date().getFullYear() - Number(profileData.year) + 4}`,
      photoUrl: `https://i.pravatar.cc/150?u=${resp.user.id}`
    });
  };

  const logout = () => {
    setRole(null);
    setUserId(null);
    setIsStudentView(false);
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    } catch (error) {
        console.error("Could not remove from localStorage", error);
    }
  };

  const switchToStudentView = () => {
    if (role === 'Admin' || role === 'Tutor') {
      setIsStudentView(true);
    }
  };

  const switchToAdminView = () => {
    setIsStudentView(false);
  };

  const effectiveRole = (role === 'Admin' || role === 'Tutor') && isStudentView ? 'Student' : role;

  const value = { role, userId, effectiveRole, studentLoginCount, tutorLoginCount, login, register, logout, switchToStudentView, switchToAdminView };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};