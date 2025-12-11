import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/index';
import { Link, Navigate } from 'react-router-dom';
import { PROGRAMS } from '../constants';
import * as authApi from '../services/authService';

type RegisterRole = 'Student' | 'Tutor';

const RegisterPage: React.FC = () => {
  const { register, role, login } = useAuth();
  const { t } = useLanguage();

  const [registerRole, setRegisterRole] = useState<RegisterRole>('Student');
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    program: PROGRAMS[0].name,
    year: 1,
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateRollNumber = (rollNumber: string): string | null => {
    const regex = /^24adu(\d{3})$/;
    const match = rollNumber.match(regex);
    if (!match) {
      return t('rollNumberInvalidFormat');
    }
    const num = parseInt(match[1], 10);
    if (num < 0 || num > 400) {
      return t('rollNumberInvalidRange');
    }
    return null;
  };

  const validateDateOfBirth = (dob: string): string | null => {
    const today = new Date();
    const birthDate = new Date(dob);
    today.setHours(0, 0, 0, 0); 
    if (birthDate >= today) {
      return t('dobInvalid');
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (registerRole === 'Tutor') {
      // Minimal validation for tutor
      if (!formData.name || !formData.email) {
        setError(t('invalidCredentials'));
        return;
      }
      setIsLoading(true);
      try {
        await authApi.registerTutor({ name: formData.name, email: formData.email, password: formData.password });
        await login('Tutor', formData.email, formData.password);
        alert(t('registrationSuccess'));
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const rollNumberError = validateRollNumber(formData.rollNumber);
    if (rollNumberError) {
      setError(rollNumberError);
      return;
    }

    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (dobError) {
      setError(dobError);
      return;
    }
 
    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        rollNumber: formData.rollNumber,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        program: formData.program,
        year: Number(formData.year),
        phone: '', // These can be empty and filled later in profile
        collegeEmail: `${formData.rollNumber}@university.edu`,
        personalEmail: '',
        address: '',
        batch: `${new Date().getFullYear() - Number(formData.year) + 1}-${new Date().getFullYear() - Number(formData.year) + 4}`
      });
      alert(t('registrationSuccess'));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (role) {
    return <Navigate to="/" replace />;
  }
  
  const inputStyles = "appearance-none block w-full px-4 py-3 bg-white border-2 border-ui-border rounded-xl text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary sm:text-sm transition";

  return (
    <div className="h-screen bg-ui-background p-4 overflow-y-auto">
      <div className="w-full max-w-lg mx-auto my-8 sm:my-12 p-8 sm:p-12 space-y-8 bg-ui-card rounded-3xl shadow-apple-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ui-text-primary tracking-tight">{t('registerTitle')}</h1>
          <p className="mt-1 text-ui-text-secondary text-md">{t('registerPrompt')}</p>
        </div>

        <div className="bg-ui-hover p-1.5 rounded-xl flex space-x-1">
          <button type="button" onClick={() => setRegisterRole('Student')} className={`flex-1 py-2.5 px-1 text-center text-md font-medium rounded-lg transition-all ${registerRole==='Student' ? 'bg-white text-ui-primary shadow-md' : 'text-ui-text-secondary hover:bg-white/60'}`}>Student</button>
          <button type="button" onClick={() => setRegisterRole('Tutor')} className={`flex-1 py-2.5 px-1 text-center text-md font-medium rounded-lg transition-all ${registerRole==='Tutor' ? 'bg-white text-ui-primary shadow-md' : 'text-ui-text-secondary hover:bg-white/60'}`}>Tutor</button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p className="text-center text-ui-red font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
          
          <input name="name" type="text" placeholder={t('fullName')} value={formData.name} onChange={handleChange} className={inputStyles} required />
          {registerRole === 'Student' ? (
            <>
              <input name="rollNumber" type="text" placeholder={t('rollNumber')} value={formData.rollNumber} onChange={handleChange} className={inputStyles} required />
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-ui-text-secondary px-1">{t('dateOfBirth')}</label>
                <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={inputStyles} required />
              </div>
            </>
          ) : (
            <input name="email" type="email" placeholder={t('email')} value={formData.email} onChange={handleChange} className={inputStyles} required />
          )}
          <input name="password" type="password" placeholder={t('password')} value={formData.password} onChange={handleChange} className={inputStyles} required />
          <input name="confirmPassword" type="password" placeholder={t('confirmPassword')} value={formData.confirmPassword} onChange={handleChange} className={inputStyles} required />
          
          {registerRole === 'Student' && (
            <>
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-ui-text-secondary px-1">{t('filterByProgram')}</label>
                <select id="program" name="program" value={formData.program} onChange={handleChange} className={inputStyles}>
                  {PROGRAMS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-ui-text-secondary px-1">{t('year')}</label>
                <select id="year" name="year" value={formData.year} onChange={handleChange} className={inputStyles}>
                  <option value={1}>{t('yearLevel', { level: 1 })}</option>
                  <option value={2}>{t('yearLevel', { level: 2 })}</option>
                  <option value={3}>{t('yearLevel', { level: 3 })}</option>
                </select>
              </div>
            </>
          )}
          
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-semibold text-white bg-ui-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ui-primary transition-all transform hover:scale-105 active:scale-100 disabled:bg-gray-400 disabled:scale-100">
            {isLoading ? t('registering') : t('register')}
          </button>
        </form>

        <p className="text-center text-md text-ui-text-secondary">
          {t('alreadyHaveAccountPrompt')} <Link to="/login" className="font-semibold text-ui-primary hover:underline">{t('backToLogin')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;