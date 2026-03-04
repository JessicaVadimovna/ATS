import type { ResumeData } from "../types/resume";

// Файл openrouter.ts сохраняется как резервный fallback (не используется в основной логике)
// Основной AI-прокси находится в api/analyze.js (Vercel Serverless Function)

export type ActionableSuggestion = {
    id: string;
    text: string;
    type: 'add_skill' | 'update_experience' | 'update_summary';
    payload: any;
    isApplied: boolean;
};

export type AIAnalysisResult = {
    score: number;
    suggestions: ActionableSuggestion[];
};

export const analyzeResume = async (resumeData: ResumeData, jobDescription: string): Promise<AIAnalysisResult> => {
    // Локальный Mock, который активируется если backend /api/analyze недоступен
    return new Promise((resolve) => {
        setTimeout(() => {
            const hasReact = jobDescription.toLowerCase().includes('react');

            const baseScore = Math.floor(Math.random() * 20) + 70;

            const dynamicSuggestions: ActionableSuggestion[] = [];

            if (hasReact && !resumeData.skills.some(s => s.name.toLowerCase().includes('redux'))) {
                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-1`,
                    text: "Вакансия требует глубокого знания экосистемы React. Рекомендую добавить 'Redux Toolkit' или 'Zustand' в ваши навыки для повышения ATS-скоринга.",
                    type: 'add_skill',
                    payload: { name: 'Redux Toolkit', level: 4 },
                    isApplied: false
                });
            } else {
                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-1`,
                    text: "Обязательно добавьте 'CI/CD Pipeline' в раздел навыков. Этот термин часто триггерит ATS системы на позициях уровня Middle/Senior.",
                    type: 'add_skill',
                    payload: { name: 'CI/CD (GitLab/Actions)', level: 4 },
                    isApplied: false
                });
            }

            dynamicSuggestions.push({
                id: `ai-sug-${Date.now()}-2`,
                text: "В вашем опыте работы не хватает измеримых метрик. Замените общие фразы на достижения в цифрах (например: 'оптимизировал производительность на 35%').",
                type: 'update_experience',
                payload: { experienceId: resumeData.experience[0]?.id || 'exp-1', newDescription: (resumeData.experience[0]?.description || '') + '\nОптимизировал производительность бандла с помощью Webpack/Vite, уменьшив время загрузки на 35%.' },
                isApplied: false
            });

            const currentSummary = resumeData.personalInfo.summary || '';
            dynamicSuggestions.push({
                id: `ai-sug-${Date.now()}-3`,
                text: "Сделайте 'Summary' более агрессивным и сфокусированным на бизнес-результатах, которые ищет работодатель в описании вакансии.",
                type: 'update_summary',
                payload: { newSummary: currentSummary + ' Проектирую масштабируемую архитектуру Frontend-приложений с нуля до Production.' },
                isApplied: false
            });

            resolve({
                score: baseScore,
                suggestions: dynamicSuggestions
            });
        }, 1500);
    });
};
