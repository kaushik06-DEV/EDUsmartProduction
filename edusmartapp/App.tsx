

import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AskAiPage from './pages/AskAiPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import CourseDetailPage from './pages/CourseDetailPage';
import TasksPage from './pages/TasksPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import StudentViewBanner from './components/StudentViewBanner';
import { DataProvider, useData } from './contexts/DataContext';
import RequestBookPage from './pages/RequestBookPage';
import TutorPage from './pages/TutorPage';
import { LanguageProvider, useLanguage } from './i18n/index';
import SettingsPage from './pages/SettingsPage';
import StudentsListPage from './pages/StudentsListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import StudyEnginePage from './pages/StudyEnginePage';
import AIHubPage from './pages/AIHubPage';
import HackathonsListPage from './pages/HackathonsListPage';
import HackathonDetailPage from './pages/HackathonDetailPage';
import Icon from './components/Icon';
import DashboardPage from './pages/DashboardPage';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import CertificatesPage from './pages/CertificatesPage';
import CertificateDetailPage from './pages/CertificateDetailPage';
import CertificateManagementPage from './pages/admin/CertificateManagementPage';
import IssueCertificatePage from './pages/tutor/IssueCertificatePage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const { role, effectiveRole } = useAuth();

    const hideHeaderFor = ['/ask-ai', '/login', '/register', '/study-engine'];
    const showHeader = !hideHeaderFor.includes(location.pathname);
    const isStudentView = (role === 'Admin' || role === 'Tutor') && effectiveRole === 'Student';

    return (
        <div className="flex flex-col h-full bg-ui-background font-sans text-ui-text-primary">
            {isStudentView && <StudentViewBanner />}
            {showHeader && <Header />}
            <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                    <Route path="/certificates/:certificateId" element={<CertificateDetailPage />} />
                    
                    {effectiveRole === 'Student' && (
                        <>
                            <Route path="/ai-hub" element={<AIHubPage />} />
                            <Route path="/ask-ai" element={<AskAiPage />} />
                            <Route path="/study-engine" element={<StudyEnginePage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/request-book" element={<RequestBookPage />} />
                            <Route path="/hackathons" element={<HackathonsListPage />} />
                            <Route path="/hackathons/:hackathonId" element={<HackathonDetailPage />} />
                        </>
                    )}
                     {effectiveRole === 'Admin' && (
                        <>
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/admin/certificates" element={<CertificateManagementPage />} />
                        </>
                     )}
                     {effectiveRole === 'Tutor' && (
                        <>
                            <Route path="/tutor" element={<TutorPage />} />
                            <Route path="/students" element={<StudentsListPage />} />
                            <Route path="/students/:studentId" element={<StudentDetailPage />} />
                            <Route path="/tutor/issue-certificate" element={<IssueCertificatePage />} />
                        </>
                     )}
                     
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </main>
            <BottomNav />
        </div>
    );
};

const FullScreenLoader: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-ui-background">
            <svg className="animate-spin h-10 w-10 text-ui-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-ui-text-secondary">{t('loadingExperience')}</p>
        </div>
    );
};

const FullScreenError: React.FC<{ message: string }> = ({ message }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-ui-background p-4 text-center">
             <div className="w-16 h-16 bg-red-100 text-ui-red mx-auto rounded-2xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-ui-text-primary">{t('errorTitle')}</h2>
            <p className="mt-2 text-md text-ui-text-secondary max-w-md">{t('errorDescription')}</p>
            <p className="mt-2 text-sm text-ui-text-secondary/80 bg-ui-hover p-2 rounded-lg font-mono">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-ui-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-80 transition-colors"
            >
                {t('tryAgain')}
            </button>
        </div>
    );
};

// Helper function to check localStorage
const hasSeenWelcomePage = () => {
    try {
        return localStorage.getItem('hasSeenWelcomePage') === 'true';
    } catch (e) {
        console.error("Could not read from localStorage", e);
        return false; // Default to showing welcome on error
    }
};

const MainApp: React.FC = () => {
    const { role } = useAuth();
    const { loading, error } = useData();
    const [seenWelcome, setSeenWelcome] = React.useState(hasSeenWelcomePage());

    const handleWelcomeSkip = () => {
        try {
            localStorage.setItem('hasSeenWelcomePage', 'true');
            setSeenWelcome(true);
        } catch (e) {
            console.error("Could not write to localStorage", e);
        }
    };

    // The loader should only show when we are fetching data for a logged-in user.
    if (loading && role) {
        return <FullScreenLoader />;
    }

    // Errors can be shown at any point if they occur.
    if (error) {
        return <FullScreenError message={error} />;
    }

    return (
        <Routes>
            {
                !seenWelcome ? (
                    <>
                        <Route path="/welcome" element={<WelcomePage onSkip={handleWelcomeSkip} />} />
                        <Route path="*" element={<Navigate to="/welcome" replace />} />
                    </>
                ) : !role ? (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <>
                        {/* Redirect away from login/welcome if already authenticated */}
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/register" element={<Navigate to="/" replace />} />
                        <Route path="/welcome" element={<Navigate to="/" replace />} />
                        <Route path="/*" element={<AppContent />} />
                    </>
                )
            }
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <LanguageProvider>
            <HashRouter>
                <MainApp />
            </HashRouter>
        </LanguageProvider>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;
