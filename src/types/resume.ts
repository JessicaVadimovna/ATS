export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 1-5
}

export interface PersonalInfo {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
}

// Порядок секций для drag-and-drop на уровне секций
export type SectionId = 'personalInfo' | 'experience' | 'education' | 'skills';
