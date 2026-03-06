import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, SectionId } from '../types/resume';

interface ResumeContextType {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
    sectionOrder: SectionId[];
    setSectionOrder: React.Dispatch<React.SetStateAction<SectionId[]>>;
    isSaved: boolean;
}

const STORAGE_KEY = 'ats_resume_data';
const SECTION_ORDER_KEY = 'ats_section_order';

const initialData: ResumeData = {
    personalInfo: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        github: '',
        linkedin: '',
    },
    experience: [],
    education: [],
    skills: [],
};

const defaultSectionOrder: SectionId[] = ['personalInfo', 'experience', 'education', 'skills'];

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw) as T;
    } catch (_) { /* ignore */ }
    return fallback;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ResumeData>(() => loadFromStorage(STORAGE_KEY, initialData));
    const [sectionOrder, setSectionOrder] = useState<SectionId[]>(() => loadFromStorage(SECTION_ORDER_KEY, defaultSectionOrder));
    const [isSaved, setIsSaved] = useState(false);

    // Auto-save resume data to localStorage on every change
    useEffect(() => {
        const timeout = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000); // flash for 2 seconds
            } catch (_) { /* quota exceeded */ }
        }, 400); // debounce 400ms

        return () => clearTimeout(timeout);
    }, [data]);

    // Auto-save section order
    useEffect(() => {
        try {
            localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(sectionOrder));
        } catch (_) { /* ignore */ }
    }, [sectionOrder]);

    return (
        <ResumeContext.Provider value={{ data, setData, sectionOrder, setSectionOrder, isSaved }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};
