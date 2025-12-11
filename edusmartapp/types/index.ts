
export enum ProgramId {
  CS_TRADITIONAL = 'cs-traditional',
  CS_TECH = 'cs-tech',
  IT = 'it',
  CS_COGNITIVE = 'cs-cognitive',
  CS_AI_DS = 'cs-ai-ds',
  CS_CYBER = 'cs-cyber',
}

export interface Program {
  id: ProgramId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  hasPartnership?: boolean;
}

export enum MaterialType {
  VIDEO = 'video',
  PDF = 'pdf',
  QUIZ = 'quiz',
  SLIDES = 'slides',
  ASSIGNMENT = 'assignment',
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: MaterialType;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  programId: ProgramId;
  description: string;
  industryRelevance: number;
  materials: CourseMaterial[];
  level: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    sources?: GroundingSource[];
    quiz?: QuizQuestion;
}

export interface GroundingSource {
    web: {
        uri: string;
        title: string;
    }
}

export type UserRole = 'Admin' | 'Student' | 'Tutor';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface BookRequest {
  id: string;
  bookTitle: string;
  courseName: string;
  status: 'Pending' | 'Accepted';
}

export interface TutorMessage {
  id: string;
  text: string;
  timestamp: number;
}

export interface AdminInstruction {
  id: string;
  text: string;
  timestamp: number;
}

export interface StudentProfile {
    id: string;
    name: string;
    phone: string;
    rollNumber: string;
    collegeEmail: string;
    personalEmail: string;
    address: string;
    program: string;
    year: number;
    photoUrl: string;
    dateOfBirth: string;
    batch: string;
    password?: string;
}

export interface TutorProfile {
    id: string;
    name: string;
    email: string;
    department: string;
    photoUrl: string;
    tutorId: string;
    phone: string;
    password?: string;
}

export interface AdminProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
    adminId: string;
    title: string;
}

// --- Hackathon Types ---

export interface HackathonResource {
    id: string;
    title: string;
    url: string;
}

export interface HackathonAnnouncement {
    id: string;
    text: string;
    timestamp: number;
}

export interface HackathonResult {
    id: string;
    rank: number;
    teamName: string;
    prize: string;
}

export interface Hackathon {
    id: string;
    title: string;
    theme: string;
    description: string;
    startDate: string;
    endDate: string;
    rules: string[];
    prizes: string[];
    resources: HackathonResource[];
    announcements: HackathonAnnouncement[];
    results: HackathonResult[];
}

export interface HackathonRegistration {
    id: string;
    hackathonId: string;
    studentId: string;
    studentName: string;
    teamName: string;
    timestamp: number;
}

// --- Notification Types ---

export type NotificationType = 'announcement' | 'task' | 'book' | 'new_user';

export interface Notification {
  id: string;
  text: string;
  type: NotificationType;
  timestamp: number;
  isRead: boolean;
  linkTo?: string;
}

// --- Leaderboard Type ---
export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  points: number;
  studentId: string;
}

// --- Certificate Types ---
export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  tutorId: string;
  tutorName: string;
  certificateName: string;
  className: string;
  department: string;
  imageUrl: string;
  issueDate: string;
}

// Fix: Add CertificateTemplate interface to resolve export error.
export interface CertificateTemplate {
  id: string;
  title: string;
  description: string;
  issuingAuthority: string;
  imageUrl?: string;
}