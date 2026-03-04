import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, SectionId } from '../types/resume';

interface ResumeContextType {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
    sectionOrder: SectionId[];
    setSectionOrder: React.Dispatch<React.SetStateAction<SectionId[]>>;
}

const initialData: ResumeData = {
    personalInfo: {
        fullName: 'Иван Иванов',
        title: 'Frontend Developer',
        email: 'ivan@example.com',
        phone: '+7 999 123-45-67',
        location: 'Москва, Россия',
        summary: 'Решаю сложные задачи с помощью React и TypeScript. Увлекаюсь UI/UX дизайном и оптимизацией производительности.',
        github: 'github.com/ivan',
        linkedin: 'linkedin.com/in/ivan',
    },
    experience: [
        {
            id: 'exp-1',
            company: 'Tech Corp',
            position: 'Senior Frontend Developer',
            startDate: '2021-01',
            endDate: '2023-12',
            description: 'Разработка архитектуры приложения. Управление командой из 3 разработчиков. Внедрение CI/CD.',
        },
    ],
    education: [
        {
            id: 'edu-1',
            institution: 'МГТУ им. Баумана',
            degree: 'Информатика и вычислительная техника, Бакалавр',
            startDate: '2015-09',
            endDate: '2019-06',
        },
    ],
    skills: [
        { id: 'skill-1', name: 'React', level: 5 },
        { id: 'skill-2', name: 'TypeScript', level: 4 },
    ],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ResumeData>(initialData);
    const [sectionOrder, setSectionOrder] = useState<SectionId[]>([
        'personalInfo', // personalInfo обычно фиксирован наверху, но добавим для полноты
        'experience',
        'education',
        'skills',
    ]);

    return (
        <ResumeContext.Provider value={{ data, setData, sectionOrder, setSectionOrder }}>
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
