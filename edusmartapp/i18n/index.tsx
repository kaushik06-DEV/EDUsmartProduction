
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

// Embed English translations directly to bypass import assertion issues and ensure instant default language loading.
const enTranslations = {
  "appName": "EduSmart",
  "home": "Home",
  "courses": "Courses",
  "askAI": "Ask AI",
  "study": "Study",
  "studyEngine": "AI Study Engine",
  "tasks": "Tasks",
  "profile": "My Profile",
  "settings": "Settings",
  "admin": "Admin",
  "tutor": "Tutor",
  "students": "Students",
  "adminPanel": "Admin Panel",
  "tutorPanel": "Tutor Panel",
  "requestBook": "Request Book",
  "welcomeBack": "Welcome Back!",
  "welcomeUser": "Welcome Back, {{name}}!",
  "readyToDiveIn": "Ready to dive back into your studies?",
  "totalCourses": "Total Courses",
  "aiQueries": "AI Queries",
  "studyTime": "Study Time",
  "recentlyAccessed": "Recently Accessed",
  "viewAll": "View All",
  "noCoursesAvailable": "No courses available yet.",
  "tutorCanAddCourses": "A tutor can import dummy data or add courses from the tutor panel.",
  "searchForCourses": "Search for courses...",
  "filterByProgram": "Filter by Program",
  "showingCourses": "Showing {{count}} of {{total}} courses. All courses are freely accessible.",
  "noCoursesFound": "No courses found",
  "adjustFilters": "Try adjusting your search or filters.",
  "adminNeedsToImportData": "An administrator needs to import data first.",
  "advancedFilters": "Advanced Filters",
  "industryRelevance": "Industry Relevance",
  "courseLevel": "Course Level",
  "yearLevel": "Year {{level}}",
  "clearAllFilters": "Clear All Filters",
  "courseNotFound": "Course not found",
  "backToCourses": "Back to all courses",
  "startStudying": "Start Studying",
  "courseMaterials": "Course Materials",
  "noMaterialsAvailable": "No materials available for this course yet.",
  "tutorMode": "Tutor Mode",
  "aiAssistant": "AI Assistant",
  "explanation": "Explanation",
  "tutorModeEnabledMessage": "Tutor Mode enabled. I'm here to help you learn! Ask me for a quiz or an explanation.",
  "tutorModeDisabledMessage": "Tutor Mode disabled. How can I assist you?",
  "quizMessage": "Here is a quiz question about {{topic}}:",
  "quizGenerationFailed": "Sorry, I couldn't generate a quiz question right now.",
  "errorFetchingResponse": "An error occurred while fetching the response.",
  "quizMeOn": "Quiz me on",
  "explainStepByStep": "Give me a step-by-step explanation for",
  "tutorPlaceholder": "Ask for a quiz or an explanation...",
  "assistantPlaceholder": "Ask a question...",
  "studyEnginePlaceholder": "Ask a question to start a study session...",
  "sessionTopic": "Session Topic",
  "studyTips": "Study Tips",
  "studyTip1": "Try to explain the concept back to the AI in your own words.",
  "studyTip2": "Ask for examples if you're stuck.",
  "endSession": "End Session",
  "sessionEnded": "Study session ended. Let's start a new topic!",
  "adminName": "Admin User",
  "adminRole": "System Administrator",
  "tutorName": "Dr. Evelyn Reed",
  "tutorRole": "Academic Tutor",
  "studentName": "Alex Doe",
  "studentId": "Student ID",
  "year": "Year",
  "roleActions": "{{role}} Actions",
  "switchToStudentView": "Switch to Student View",
  "addNewTask": "Add a New Task",
  "taskPlaceholder": "e.g., Finish CS101 assignment",
  "addTask": "Add Task",
  "toDo": "To-Do",
  "noPendingTasks": "No pending tasks. Great job!",
  "completed": "Completed",
  "welcomeToAppName": "Welcome to EduSmart",
  "loginPrompt": "Your intelligent learning partner. Please select your role to continue.",
  "loginAsAdmin": "Login as Admin",
  "loginAsTutor": "Login as Tutor",
  "loginAsStudent": "Login as Student",
  "adminCoordinatorDashboard": "Admin Coordinator Dashboard",
  "studentLogins": "Student Logins",
  "tutorLogins": "Tutor Logins",
  "broadcastInstructions": "Broadcast Instructions",
  "broadcastDescription": "Send a message to all tutors and students. The latest message will be displayed on their dashboards.",
  "enterInstruction": "Enter instruction...",
  "broadcast": "Broadcast",
  "messagesFromTutors": "Messages from Tutors",
  "noTutorMessages": "No messages from tutors yet.",
  "courseOverview": "Course Overview",
  "noCoursesAdded": "No courses have been added yet.",
  "bookRequestOverview": "Book Request Overview",
  "noBookRequests": "No book requests have been submitted yet.",
  "for": "For",
  "pending": "Pending",
  "accepted": "Accepted",
  "instructionCannotBeEmpty": "Instruction cannot be empty.",
  "instructionBroadcasted": "Instruction broadcasted successfully!",
  "requestABook": "Request a Book",
  "requestBookDescription": "If you need a book for one of your courses that isn't available, you can request it here. Our administrators will review your request.",
  "bookTitle": "Book Title",
  "bookTitlePlaceholder": "e.g., Introduction to Algorithms",
  "relevantCourse": "Relevant Course",
  "submitRequest": "Submit Request",
  "yourRequestHistory": "Your Request History",
  "course": "Course",
  "noBookRequestsMade": "You haven't made any book requests yet.",
  "fillAllFields": "Please fill in all fields.",
  "bookRequestSubmitted": "Your book request has been submitted!",
  "tutorDashboard": "Tutor Dashboard",
  "tutorDashboardDescription": "Manage course content and respond to student requests.",
  "latestInstructionFromAdmin": "Latest Instruction from Admin",
  "postedOn": "Posted on",
  "contactAdmin": "Contact Admin",
  "contactAdminPlaceholder": "Have a question or a doubt? Send a message to the administrator.",
  "sendMessage": "Send Message",
  "addCourse": "Add New Course",
  "courseName": "Course Name",
  "courseCode": "Course Code (e.g., CS101)",
  "courseDescription": "Course Description",
  "addCourseMaterials": "Add Course Materials",
  "selectCourse": "Select Course",
  "selectACourse": "Select a course",
  "addCourseFirst": "Please add a course first",
  "materialTitle": "Material Title",
  "materialTitlePlaceholder": "e.g., Week 1 Lecture Slides",
  "materialType": "Material Type",
  "addMaterial": "Add Material",
  "manageBookRequests": "Manage Book Requests",
  "forCourse": "For course",
  "accept": "Accept",
  "noPendingRequests": "No pending requests.",
  "noAcceptedRequests": "No accepted requests.",
  "manageExistingCourses": "Manage Existing Courses",
  "deleteCourse": "Delete",
  "deleteCourseConfirmation": "Are you sure you want to delete the course '{{courseName}}'? This action cannot be undone.",
  "courseDeletedSuccessfully": "Course deleted successfully!",
  "fillAllCourseFields": "Please fill all course fields.",
  "courseAddedSuccessfully": "Course added successfully!",
  "selectCourseAndTitle": "Please select a course and provide a material title.",
  "materialAddedSuccessfully": "Course material added successfully!",
  "messageCannotBeEmpty": "Message cannot be empty.",
  "messageSentToAdmin": "Message sent to Admin!",
  "language": "Language",
  "account": "Account",
  "logOut": "Log Out",
  "adminAnnouncements": "Announcements from Admin",
  "studentProfile": "Student Profile",
  "fullName": "Full Name",
  "phoneNumber": "Phone Number",
  "rollNumber": "Roll Number",
  "collegeEmail": "College Email",
  "email": "Email",
  "department": "Department",
  "personalEmail": "Personal Email",
  "address": "Address",
  "contactInformation": "Contact Information",
  "academicInformation": "Academic Information",
  "noStudentProfile": "Student profile not found.",
  "backToStudents": "Back to Students List",
  "selectStudentToView": "Select a student to view their profile.",
  "courseManagement": "Course Management",
  "existingCourses": "Existing Courses",
  "viewMaterials": "View Materials",
  "aiHub": "AI Hub",
  "aiLearningHub": "AI Learning Hub",
  "aiHubDescription": "Your central place for intelligent learning tools. Choose an option to get started.",
  "aiAssistantDescription": "Get instant answers to your questions, summaries of topics, and help with your coursework.",
  "studyEngineDescription": "Engage in an interactive dialogue with an AI tutor to deepen your understanding of any subject.",
  "toolsAndSettings": "Tools & Settings",
  "myTasks": "My Tasks",
  "appSettings": "App Settings",
  "accountManagement": "Account Management",
  "updatePassword": "Update Password",
  "preferences": "Preferences",
  "appTheme": "App Theme",
  "light": "Light",
  "dark": "Dark",
  "system": "System",
  "edit": "Edit",
  "save": "Save",
  "cancel": "Cancel",
  "dateOfBirth": "Date of Birth",
  "batch": "Batch",
  "tutorId": "Tutor ID",
  "adminId": "Admin ID",
  "title": "Title",
  "hackathon": "Hackathon",
  "hackathons": "Hackathons",
  "upcomingHackathons": "Browse our upcoming hackathon events.",
  "viewDetails": "View Details",
  "hackathonNotFound": "Hackathon Not Found",
  "backToHackathons": "Back to Hackathons List",
  "checkBackLater": "Please check back later for new events!",
  "noAnnouncements": "No new announcements.",
  "hackathonManagement": "Hackathon Management",
  "eventDetails": "Event Details",
  "theme": "Theme",
  "description": "Description",
  "rules": "Rules",
  "prizes": "Prizes",
  "saveHackathonDetails": "Save Hackathon Details",
  "hackathonDetailsUpdated": "Hackathon details updated successfully.",
  "registrations": "Registrations",
  "announcements": "Announcements",
  "newAnnouncement": "New announcement...",
  "post": "Post",
  "announcementPosted": "Announcement posted successfully.",
  "results": "Results",
  "resultsJsonPlaceholder": "Enter results as JSON array...",
  "publishResults": "Publish Results",
  "resultsPublished": "Results published successfully.",
  "invalidResultsJson": "Invalid JSON format for results. Please check and try again.",
  "hackathonOverview": "Hackathon Overview",
  "participatingStudents": "Participating Students",
  "noRegistrationsYet": "No students have registered yet.",
  "noHackathonActive": "No hackathons are currently active.",
  "teamName": "Team Name",
  "register": "Register",
  "yourStatus": "Your Status",
  "registered": "Registered",
  "registrationSuccessful": "You have successfully registered for the hackathon!",
  "enterTeamName": "Please enter a team name.",
  "alreadyRegistered": "You are already registered for this hackathon.",
  "registration": "Registration",
  "leaderboard": "Leaderboard",
  "createHackathon": "Create New Hackathon",
  "createHackathonDescription": "No hackathon is currently active. Create one to get started.",
  "hackathonCreated": "New hackathon created. You can now edit its details.",
  "dangerZone": "Danger Zone",
  "deleteHackathon": "Delete Hackathon",
  "deleteHackathonConfirmation": "Are you sure you want to delete this hackathon? This will remove all event details and registrations permanently.",
  "hackathonDeleted": "Hackathon deleted successfully.",
  "databaseManagement": "Database Management",
  "databaseManagementDescription": "Control the application's entire dataset. Use with caution.",
  "initializeDatabase": "Initialize / Reset Database",
  "databaseInitialized": "Database has been initialized with default data.",
  "clearDatabase": "Clear All Data",
  "databaseCleared": "All application data has been cleared.",
  "dateOfBirthPasswordLabel": "Date of Birth (Password)",
  "noStudentProfilesAvailable": "No student profiles are available in the system.",
  "loadingExperience": "Loading your experience...",
  "errorTitle": "Something went wrong",
  "errorDescription": "We couldn't load the necessary application data. Please check your connection and try again.",
  "tryAgain": "Try Again",
  "authenticating": "Authenticating...",
  "invalidCredentials": "Invalid credentials. Please try again.",
  "studentQuote": "Let's make today a productive day of learning.",
  "myCourses": "My Courses",
  "upcomingTasks": "Upcoming Tasks",
  "viewAllTasks": "View All Tasks",
  "noUpcomingTasks": "No upcoming tasks. You're all clear!",
  "quickActions": "Quick Actions",
  "startStudySession": "Start Study Session",
  "tutorDashboardTitle": "Tutor Dashboard",
  "tutorDashboardGreeting": "Welcome, {{name}}!",
  "pendingBookRequests": "Pending Book Requests",
  "totalStudents": "Total Students",
  "messagesToAdmin": "Messages to Admin",
  "addNewCourse": "Add New Course",
  "manageStudents": "Manage Students",
  "noPendingBookRequests": "No pending book requests.",
  "adminDashboardTitle": "Administrator Dashboard",
  "systemOverview": "System Overview",
  "broadcastAnnouncement": "Broadcast Announcement",
  "broadcastPlaceholder": "Enter a message to broadcast to all users...",
  "recentTutorMessages": "Recent Tutor Messages",
  "aiGreeting": "Hello! I'm your AI Assistant. How can I help you with your studies today?",
  "dashboard": "Dashboard",
  "myCertificates": "My Certificates",
  "about": "About",
  "openMenu": "Open Menu",
  "aboutAppName": "About EduSmart",
  "aboutDescription": "Your personal AI-powered learning companion, designed to help you succeed in your college journey.",
  "featureAITitle": "AI Assistant",
  "featureAIDescription": "Get instant answers, summaries, and help with your coursework, available 24/7.",
  "featureStudyTitle": "Interactive Study",
  "featureStudyDescription": "Engage in a dialogue with an AI tutor to deepen your understanding of any subject.",
  "featureCoursesTitle": "Centralized Courses",
  "featureCoursesDescription": "Access all your university course materials and resources in one organized place.",
  "ourMission": "Our Mission",
  "ourMissionDescription": "To provide students with a centralized, intelligent, and personalized learning platform that adapts to their needs, making education more accessible and effective.",
  "certificatesComingSoon": "This feature is coming soon! Track your achievements and download certificates here in the future.",
  "certificateManagement": "Certificate Management",
  "myCertificatesDescription": "A collection of all the certificates you have earned.",
  "noCertificatesYet": "You haven't earned any certificates yet.",
  "noCertificatesDescription": "Complete courses to earn certificates and see them here.",
  "certificateNotFound": "Certificate Not Found",
  "backToMyCertificates": "Back to My Certificates",
  "thisIsToCertifyThat": "This is to certify that",
  "dateOfIssue": "Date of Issue",
  "issuingAuthority": "Issuing Authority",
  "issuedBy": "Issued by",
  "searchStudent": "Search for a Student",
  "searchStudentPlaceholder": "Search by name or roll number...",
  "selectStudent": "Select Student",
  "selectAStudent": "--- Select a Student ---",
  "certificateIssuedSuccess": "Certificate issued successfully!",
  "provideCertificate": "Provide Certificate",
  "issueCertificate": "Issue Certificate",
  "selectTemplate": "Select Template",
  "enterCourseName": "Enter Course Name",
  "createNewTemplate": "Create New Template",
  "editTemplate": "Edit Template",
  "templateTitle": "Template Title (e.g., Certificate of Achievement)",
  "templateDescription": "Template Description",
  "templateImageUrl": "Image URL (e.g., for a seal or logo)",
  "saveTemplate": "Save Template",
  "templateCreatedSuccess": "Template created successfully!",
  "templateUpdatedSuccess": "Template updated successfully!",
  "confirmDeleteTemplate": "Are you sure you want to delete this template?",
  "templateDeletedSuccess": "Template deleted successfully!",
  "existingTemplates": "Existing Templates",
  "noTemplatesExist": "No certificate templates exist. Create one to get started.",
  "password": "Password",
  "registerTitle": "Create Student Account",
  "registerPrompt": "Join the platform to start your learning journey.",
  "confirmPassword": "Confirm Password",
  "noAccountPrompt": "Don't have an account?",
  "alreadyHaveAccountPrompt": "Already have an account?",
  "backToLogin": "Back to Login",
  "registering": "Registering...",
  "rollNumberInvalidFormat": "Roll Number must be in the format '24aduXXX'.",
  "rollNumberInvalidRange": "Roll Number must be between 24adu000 and 24adu400.",
  "dobInvalid": "Date of Birth must be in the past.",
  "passwordMismatch": "Passwords do not match.",
  "registrationSuccess": "Registration successful! You are now logged in.",
  "userAlreadyExists": "A student with this roll number already exists."
};


type Language = 'en' | 'es' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  // Initialize state with the embedded English translations and an empty object for other languages.
  const [translations, setTranslations] = useState<Record<Language, any>>({ en: enTranslations, es: {}, ta: {} });
  // Keep track of which languages have been fetched to avoid redundant network requests.
  const [loadedLanguages, setLoadedLanguages] = useState<Set<Language>>(new Set(['en']));

  // On initial load, check localStorage for a saved language preference.
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduSmartLanguage') as Language | null;
    if (savedLanguage && ['en', 'es', 'ta'].includes(savedLanguage)) {
      setLanguage(savedLanguage); // Use the setter to trigger loading if necessary.
    }
  }, []);

  const setLanguage = async (lang: Language) => {
    // If the selected language hasn't been loaded yet, fetch it.
    if (!loadedLanguages.has(lang)) {
      try {
        // Fix: Use a root-relative path to ensure files are found from any route.
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Update the translations state with the newly fetched data.
        setTranslations(prev => ({ ...prev, [lang]: data }));
        // Mark this language as loaded.
        setLoadedLanguages(prev => new Set(prev).add(lang));
      } catch (error) {
        console.error(`Failed to load translations for ${lang}`, error);
        // Don't switch language if the fetch fails, to avoid a broken state.
        return;
      }
    }
    // Persist the new language choice to localStorage and update the component's state.
    localStorage.setItem('eduSmartLanguage', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    const langTranslations = translations[language] || translations['en'];
    let translation = langTranslations[key] || key;
    
    // Replace placeholders like {{count}} with actual values.
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
