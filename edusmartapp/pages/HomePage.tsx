import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentHomePage from './student/StudentHomePage';
import TutorHomePage from './tutor/TutorHomePage';
import AdminHomePage from './admin/AdminHomePage';

const FullScreenLoader: React.FC = () => (
    <div className="flex items-center justify-center h-screen bg-ui-background">
        <svg className="animate-spin h-8 w-8 text-ui-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const HomePage: React.FC = () => {
    const { effectiveRole } = useAuth();

    switch (effectiveRole) {
        case 'Student':
            return <StudentHomePage />;
        case 'Tutor':
            return <TutorHomePage />;
        case 'Admin':
            return <AdminHomePage />;
        default:
            return <FullScreenLoader />;
    }
};

export default HomePage;