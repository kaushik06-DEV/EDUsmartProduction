import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const StudentViewBanner: React.FC = () => {
    const { role, switchToAdminView } = useAuth();

    return (
        <div className="bg-yellow-400 text-yellow-900 text-center p-2 flex items-center justify-center sticky top-0 z-50">
            <p className="font-semibold text-sm mr-4">
                You are currently viewing the app as a student.
            </p>
            <button 
                onClick={switchToAdminView}
                className="bg-yellow-800 text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-yellow-900 transition-colors"
            >
                Return to {role} View
            </button>
        </div>
    );
};

export default StudentViewBanner;