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

    let backendFailed = false;

    try {
        // Запрос к нашему Vercel Serverless Function
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            // Читаем реальный текст ошибки с сервера
            const errBody = await response.text().catch(() => 'no body');
            // Бросаем с пометкой что это ошибка СЕРВЕРА (не сети), чтобы пробросить её в UI
            throw new Error(`SERVER:${response.status}:${errBody}`);
        }

        const responseText = await response.text();
        const parsedResponse = JSON.parse(responseText);

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
        const msg: string = error?.message || String(error);
        console.error("[AI] Ошибка:", msg);

        // Если сервер ответил ошибкой (SERVER:...) — показываем реальную причину, NOT mock
        if (msg.startsWith('SERVER:')) {
            backendFailed = true;
            throw new Error(`Ошибка AI-сервера: ${msg.replace('SERVER:', '')}`);
        }

        // Иначе — сетевая ошибка (localhost без Vercel CLI), показываем mock
        console.warn("[AI] Сервер недоступен по сети, включаю локальный Mock...");
    }

    // Mock fallback (только для локальной разработки без Vercel CLI)
    if (!backendFailed) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hasReact = jobDescription.toLowerCase().includes('react');
                const baseScore = Math.floor(Math.random() * 20) + 70;
                const dynamicSuggestions: ActionableSuggestion[] = [];

                if (hasReact && !resumeData.skills.some(s => s.name.toLowerCase().includes('redux'))) {
                    dynamicSuggestions.push({
                        id: `ai-sug-${Date.now()}-1`, text: "[Mock] Вакансия требует React. Добавьте 'Redux Toolkit' в навыки.", type: 'add_skill', payload: { name: 'Redux Toolkit', level: 4 }, isApplied: false
                    });
                } else {
                    dynamicSuggestions.push({
                        id: `ai-sug-${Date.now()}-1`, text: "[Mock] Добавьте 'CI/CD Pipeline' в раздел навыков.", type: 'add_skill', payload: { name: 'CI/CD (GitLab/Actions)', level: 4 }, isApplied: false
                    });
                }

                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-2`, text: "[Mock] Замените общие фразы на достижения в цифрах.", type: 'update_experience', payload: { experienceId: resumeData.experience[0]?.id || 'exp-1', newDescription: (resumeData.experience[0]?.description || '') + '\nОптимизировал производительность бандла, уменьшив время загрузки на 35%.' }, isApplied: false
                });

                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-3`, text: "[Mock] Сделайте 'Summary' сфокусированным на бизнес-результатах.", type: 'update_summary', payload: { newSummary: (resumeData.personalInfo.summary || '') + ' Проектирую масштабируемую архитектуру Frontend-приложений с нуля до Production.' }, isApplied: false
                });

                resolve({ score: baseScore, suggestions: dynamicSuggestions });
            }, 1000);
        });
    }

    // TypeScript satisfy — never reached
    throw new Error("Unexpected state");
};
