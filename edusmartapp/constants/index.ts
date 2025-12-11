
// Fix: Import CertificateTemplate to use its type definition.
import { Program, Course, ProgramId, MaterialType, StudentProfile, AdminProfile, TutorProfile, Hackathon, HackathonRegistration, LeaderboardEntry, CertificateTemplate } from '../types';

export const PROGRAMS: Program[] = [
  { id: ProgramId.CS_TRADITIONAL, name: 'B.Sc. Computer Science', shortName: 'CS', description: 'Core CS fundamentals, algorithms, and software engineering.', color: 'bg-blue-500' },
  { id: ProgramId.CS_TECH, name: 'B.Sc. Computer Technology', shortName: 'CompTech', description: 'Hardware-software integration, embedded systems, and networks.', color: 'bg-green-500' },
  { id: ProgramId.IT, name: 'B.Sc. Information Technology', shortName: 'IT', description: 'Business-IT alignment, web technologies, and project management.', color: 'bg-purple-500' },
  { id: ProgramId.CS_COGNITIVE, name: 'B.Sc. Computer Science (Cognitive Systems)', shortName: 'Cognitive', description: 'In Association with Tata Consultancy Services.', color: 'bg-sky-500', hasPartnership: true },
  { id: ProgramId.CS_AI_DS, name: 'B.Sc. CS (AI and Data Science)', shortName: 'AI/DS', description: 'Machine learning, big data analytics, and specialized AI tools.', color: 'bg-orange-500' },
  { id: ProgramId.CS_CYBER, name: 'B.Sc. Computer Science (Cyber Security)', shortName: 'CyberSec', description: 'Ethical hacking, network security, and digital forensics.', color: 'bg-red-500' },
];

export const COURSES: Course[] = [
    // CS Traditional
    // Fix: Use MaterialType enum members instead of string literals to satisfy TypeScript's type checking.
    { id: 'cs101', name: 'Data Structures', code: 'CS101', programId: ProgramId.CS_TRADITIONAL, description: 'Fundamental data structures and algorithms.', industryRelevance: 95, materials: [{id: 'm1', title: 'Week 1: Intro to Arrays', type: MaterialType.PDF}, {id: 'm2', title: 'Week 2: Linked Lists', type: MaterialType.VIDEO}], level: 1 },
    { id: 'cs201', name: 'Software Engineering', code: 'CS201', programId: ProgramId.CS_TRADITIONAL, description: 'Principles of software development lifecycle.', industryRelevance: 98, materials: [], level: 2 },

    // Computer Technology
    { id: 'ct101', name: 'Embedded Systems', code: 'CT101', programId: ProgramId.CS_TECH, description: 'Design of embedded systems with microcontrollers.', industryRelevance: 92, materials: [], level: 1 },
    { id: 'ct202', name: 'Computer Networks', code: 'CT202', programId: ProgramId.CS_TECH, description: 'Networking protocols and architecture.', industryRelevance: 96, materials: [], level: 2 },

    // Information Technology
    { id: 'it101', name: 'Web Development', code: 'IT101', programId: ProgramId.IT, description: 'Frontend and backend web technologies.', industryRelevance: 97, materials: [], level: 1 },
    { id: 'it301', name: 'IT Project Management', code: 'IT301', programId: ProgramId.IT, description: 'Managing IT projects using agile methodologies.', industryRelevance: 99, materials: [], level: 3 },

    // Cognitive Systems
    { id: 'cog101', name: 'TCS Agile Methodology', code: 'COG101', programId: ProgramId.CS_COGNITIVE, description: 'Exclusive content from TCS on agile practices.', industryRelevance: 100, materials: [], level: 1 },
    { id: 'cog202', name: 'Real-world Case Studies', code: 'COG202', programId: ProgramId.CS_COGNITIVE, description: 'Live industry projects from TCS clients.', industryRelevance: 100, materials: [], level: 2 },

    // AI & Data Science
    { id: 'ai101', name: 'Machine Learning Foundations', code: 'AI101', programId: ProgramId.CS_AI_DS, description: 'Core concepts of machine learning and algorithms.', industryRelevance: 99, materials: [], level: 1 },
    { id: 'ai201', name: 'Big Data Analytics', code: 'AI201', programId: ProgramId.CS_AI_DS, description: 'Processing and analyzing large datasets.', industryRelevance: 98, materials: [], level: 2 },

    // Cyber Security
    { id: 'cy101', name: 'Ethical Hacking', code: 'CY101', programId: ProgramId.CS_CYBER, description: 'Penetration testing and vulnerability assessment.', industryRelevance: 99, materials: [], level: 1 },
    { id: 'cy202', name: 'Cryptography', code: 'CY202', programId: ProgramId.CS_CYBER, description: 'Principles of secure communication.', industryRelevance: 97, materials: [], level: 2 },
];

const generateStudentProfiles = (): StudentProfile[] => {
    const profiles: StudentProfile[] = [];
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Mehta', 'Jain', 'Khan'];
    const programs = PROGRAMS.map(p => p.name);

    for (let i = 1; i <= 400; i++) {
        const paddedId = i.toString().padStart(3, '0');
        const rollNumber = `24adu${paddedId}`;
        const studentId = `s${i}`;
        const randomFirstName = firstNames[i % firstNames.length];
        const randomLastName = lastNames[(i + 3) % lastNames.length]; // Offset to vary names
        const name = `${randomFirstName} ${randomLastName}`;
        
        const year = 2004 + (i % 3);
        const month = (i % 12) + 1;
        const day = (i % 28) + 1;
        const dob = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const currentYear = (i % 3) + 1; // 1, 2, or 3

        profiles.push({
            id: studentId,
            name: name,
            phone: `+91 98765 ${Math.floor(10000 + Math.random() * 9000)}`,
            rollNumber: rollNumber,
            collegeEmail: `${randomFirstName.toLowerCase()}.${paddedId}@university.edu`,
            personalEmail: `${randomLastName.toLowerCase()}${i}@email.com`,
            address: `${i} College Road, Academic City, India 641001`,
            program: programs[i % programs.length],
            year: currentYear,
            photoUrl: `https://i.pravatar.cc/150?u=${studentId}`,
            dateOfBirth: dob,
            batch: `${2024 - currentYear}-${2024 - currentYear + 3}`,
            password: 'password123' // Default password for sample data
        });
    }
    return profiles;
};

// Export the function to be used for re-initializing the database with sample data.
export const getGeneratedStudentProfiles = generateStudentProfiles;

// Start with an empty array of students by default, allowing for registration.
export const STUDENT_PROFILES: StudentProfile[] = [];

export const DEFAULT_TUTOR_PROFILE: TutorProfile = {
    id: 'tutor_user_1',
    name: 'Santhosh Kumar',
    email: 'santhoshsmartboy143143@gmail.com',
    department: 'Computer Science',
    photoUrl: 'https://i.pravatar.cc/150?u=tutor',
    tutorId: 'TCS-001',
    phone: '+1 (555) 111-2222',
    password: 'santhosh143..',
};

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
    id: 'admin_user',
    name: 'Admin User',
    email: 'admin@kahedu.edu',
    phone: '7667080466',
    photoUrl: 'https://i.pravatar.cc/150?u=admin',
    adminId: 'ADM-001',
    title: 'System Administrator'
};

export const HACKATHONS: Hackathon[] = [
    {
        id: 'hack-1',
        title: 'Innovate for Tomorrow Hackathon',
        theme: 'AI for Social Good',
        description: 'Join us for a 48-hour coding marathon to build innovative solutions that address real-world social challenges using Artificial Intelligence.',
        startDate: '2024-09-20T09:00:00',
        endDate: '2024-09-22T18:00:00',
        rules: [
            'Teams must be between 2-4 members.',
            'All code must be written during the hackathon.',
            'Projects must be submitted to the specified platform by the deadline.',
            'Be respectful and collaborative.'
        ],
        prizes: [
            '1st Place: $5000 + Tech Gadgets',
            '2nd Place: $2500 + Premium Subscriptions',
            '3rd Place: $1000 + Swag Kits'
        ],
        resources: [],
        announcements: [],
        results: []
    },
    {
        id: 'hack-2',
        title: 'Cyber Sentinel Challenge',
        theme: 'Next-Gen Cybersecurity',
        description: 'A 24-hour intense competition to develop groundbreaking security tools and defense mechanisms. Protect the future of the web.',
        startDate: '2024-10-15T10:00:00',
        endDate: '2024-10-16T10:00:00',
        rules: [
            'Individual participation only.',
            'Usage of open-source libraries is permitted.',
            'A detailed report must be submitted with the project.'
        ],
        prizes: [
            'Winner: $3000 + Internship Opportunity',
            'Runner-up: $1500',
            'Honorable Mention: $500'
        ],
        resources: [],
        announcements: [],
        results: []
    }
];

export const SAMPLE_HACKATHON_REGISTRATIONS: HackathonRegistration[] = [];

// Fix: Add certificate templates mock data.
export const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
    {
        id: 'template-1',
        title: 'Certificate of Achievement',
        description: 'Awarded for outstanding performance and dedication in a specific course or subject.',
        issuingAuthority: 'EduSmart Academic Council',
        imageUrl: 'https://images.unsplash.com/photo-1593341642344-802f0261aa84?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'template-2',
        title: 'Certificate of Completion',
        description: 'Awarded for successfully completing all requirements of a course.',
        issuingAuthority: 'Department of Computer Science',
        imageUrl: 'https://images.unsplash.com/photo-1568832352379-0cf1982c35a6?q=80&w=2070&auto=format&fit=crop'
    }
];


// Generate some sample leaderboard data using student profiles
const getSampleLeaderboardData = (): LeaderboardEntry[] => {
    const studentData = getGeneratedStudentProfiles().slice(10, 20); // Use a slice of students
    const data: LeaderboardEntry[] = studentData.map((student, index) => ({
        rank: index + 1,
        studentName: student.name,
        points: 5000 - index * 250 - Math.floor(Math.random() * 200),
        studentId: student.id,
    }));
    return data;
};

export const LEADERBOARD_DATA: LeaderboardEntry[] = getSampleLeaderboardData();