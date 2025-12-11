

import React from 'react';
import Icon, { IconName } from '../components/Icon';

interface WelcomePageProps {
  onSkip: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onSkip }) => {
    const handleSkip = () => {
        onSkip();
    };

    const Feature: React.FC<{ icon: IconName; title: string; description: string }> = ({ icon, title, description }) => (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-ui-primary/10 rounded-xl text-ui-primary">
                <Icon name={icon} className="w-7 h-7" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-ui-text-primary">{title}</h3>
                <p className="text-ui-text-secondary mt-1">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-ui-background p-6 sm:p-8 text-center">
            {/* Spacer for top */}
            <div /> 
            
            <div className="max-w-2xl w-full animate-fade-in-up">
                <div className="w-24 h-24 bg-ui-primary text-white mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-apple-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 4a1 1 0 00-.606.92l.5 9A1 1 0 004 17h12a1 1 0 00.994-.999l.5-9a1 1 0 00-.606-.92l-7-4zM10 14a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-bold text-ui-text-primary tracking-tight">
                    Welcome to EduSmart
                </h1>
                <p className="mt-4 text-lg text-ui-text-secondary max-w-xl mx-auto">
                    Your personal AI-powered learning companion, designed to help you succeed in your college journey.
                </p>

                <div className="text-left space-y-8 mt-12">
                   <Feature 
                        icon="ai" 
                        title="AI Assistant"
                        description="Get instant answers, summaries, and help with your coursework."
                    />
                    <Feature 
                        icon="studyEngine" 
                        title="Interactive Study Sessions"
                        description="Engage in a dialogue with an AI tutor to deepen your understanding."
                    />
                     <Feature 
                        icon="courses"
                        title="Centralized Courses"
                        description="Access all your university course materials in one organized place."
                    />
                </div>
            </div>

            <div className="w-full max-w-2xl mt-12">
                <button 
                    onClick={handleSkip}
                    className="w-full bg-ui-primary text-white font-bold py-4 px-8 rounded-full hover:bg-opacity-80 transition-all text-lg transform hover:scale-105 active:scale-100"
                >
                    Skip & Continue to Sign In
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;