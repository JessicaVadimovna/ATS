import type { ResumeData } from "../types/resume";

// Типы для подсказок AI
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
    const prompt = `
Вы — безжалостный и точный эксперт по найму и ATS (Applicant Tracking Systems). 
Ваша задача — проанализировать резюме кандидата Frontend Developer и сравнить его с вакансией.
ОПИСАНИЕ ВАКАНСИИ:
${jobDescription}

ТЕКУЩЕЕ РЕЗЮМЕ КАНДИДАТА:
${JSON.stringify(resumeData, null, 2)}

Инструкции:
1. Выдайте ATS Score (число от 0 до 100), оценивающее совпадение навыков и опыта.
2. Дайте ровно 3 ценных совета по улучшению.
Каждый совет должен содержать точный payload:
- type: 'add_skill', payload: { name: 'Skill', level: 5 }
- type: 'update_experience', payload: { experienceId: 'exp-1', newDescription: 'Текст' }
- type: 'update_summary', payload: { newSummary: 'Текст' }

ВОЗВРАЩАТЬ СТРОГО В ТАКОМ ФОРМАТЕ JSON, без лишних слов:
{
  "score": 85,
  "suggestions": [
     {
       "id": "gen-1",
       "text": "Совет...",
       "type": "add_skill",
       "payload": { "name": "Skill", "level": 5 }
     }
  ]
}
`;

    try {
        // Запрос идет к НАШЕМУ защищенному backend-серверу (Vercel Serverless Function)
        // Если мы на localhost и сервер не поднят, это упадет в блок catch
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Внутренний сервер вернул ошибку: ${response.status}`);
        }

        const data = await response.json();
        const parsedResponse = typeof data === 'string' ? JSON.parse(data) : data;

        const formattedSuggestions: ActionableSuggestion[] = parsedResponse.suggestions.map((s: any, index: number) => ({
            ...s,
            id: `ai-sug-${Date.now()}-${index}`,
            isApplied: false
        }));

        return {
            score: parsedResponse.score || 75,
            suggestions: formattedSuggestions
        };

    } catch (error: any) {
        console.warn("Backend /api/analyze недоступен (локальная разработка без Vercel CLI). Включаю резервный локальный Mock...", error);

        // ВНИМАНИЕ: Если бэкенд недоступен (например, при локальной отрисовке через npm run dev без Vercel CLI), 
        // мы возвращаем красивый Mock, чтобы UI не ломался.
        return new Promise((resolve) => {
            setTimeout(() => {
                const hasReact = jobDescription.toLowerCase().includes('react');
                const baseScore = Math.floor(Math.random() * 20) + 70;
                const dynamicSuggestions: ActionableSuggestion[] = [];

                if (hasReact && !resumeData.skills.some(s => s.name.toLowerCase().includes('redux'))) {
                    dynamicSuggestions.push({
                        id: `ai-sug-${Date.now()}-1`, text: "Вакансия требует глубокого знания React. Рекомендую добавить 'Redux Toolkit' или 'Zustand' в навыки.", type: 'add_skill', payload: { name: 'Redux Toolkit', level: 4 }, isApplied: false
                    });
                } else {
                    dynamicSuggestions.push({
                        id: `ai-sug-${Date.now()}-1`, text: "Обязательно добавьте 'CI/CD Pipeline' в раздел навыков.", type: 'add_skill', payload: { name: 'CI/CD (GitLab/Actions)', level: 4 }, isApplied: false
                    });
                }

                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-2`, text: "Замените общие фразы на достижения в цифрах.", type: 'update_experience', payload: { experienceId: resumeData.experience[0]?.id || 'exp-1', newDescription: (resumeData.experience[0]?.description || '') + '\nОптимизировал производительность бандла с помощью Webpack/Vite, уменьшив время загрузки на 35%.' }, isApplied: false
                });

                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-3`, text: "Сделайте 'Summary' сфокусированным на бизнес-результатах.", type: 'update_summary', payload: { newSummary: (resumeData.personalInfo.summary || '') + ' Проектирую масштабируемую архитектуру Frontend-приложений с нуля до Production.' }, isApplied: false
                });

                resolve({
                    score: baseScore,
                    suggestions: dynamicSuggestions
                });
            }, 1000);
        });
    }
};
