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

        // Если лимит токенов Gemini исчерпан (429) — показываем Mock, чтобы портфолио продолжало работать для HR/гостей!
        if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('resource_exhausted')) {
            console.warn("[AI] Лимит API исчерпан. Включаю демонстрационный режим для портфолио...");
            // не ставим backendFailed = true чтобы пошел дальше в mock
        }
        // Если другая критичная серверная ошибка (например 403, 500) — показываем реальную причину
        else if (msg.startsWith('SERVER:')) {
            backendFailed = true;
            throw new Error(`Ошибка AI-сервера: ${msg.replace('SERVER:', '')}`);
        } else {
            console.warn("[AI] Ошибка сети или сервер недоступен, включаю локальный Mock...");
        }
    }

    // Mock fallback (лимит API или локальная разработка)
    if (!backendFailed) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hasReact = jobDescription.toLowerCase().includes('react');

                // Детерминированная оценка: чем больше навыков и описания, тем выше балл
                const skillScore = resumeData.skills.length * 2;
                const expScore = resumeData.experience.reduce((acc, exp) => acc + (exp.description?.length || 0) / 50, 0);
                // Базовый балл 60 + заслуги, максимум 98
                const calculatedScore = Math.min(98, Math.floor(60 + skillScore + expScore));

                const dynamicSuggestions: ActionableSuggestion[] = [];

                dynamicSuggestions.push({
                    id: `ai-sug-${Date.now()}-limit`, text: "⚠️ [AI отключен из-за лимита API. Это ДЕМО-режим] Вы превысили секундный лимит запросов сервера. Эти советы показывают логику работы интерфейса. Нажмите 'Применить', а затем снова 'Анализировать' - и вы увидите как ваш балл вырастет!", type: 'add_skill', payload: { name: 'Demo Mode', level: 1 }, isApplied: false
                });

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

                resolve({ score: calculatedScore, suggestions: dynamicSuggestions });
            }, 1000);
        });
    }

    // TypeScript satisfy — never reached
    throw new Error("Unexpected state");
};
