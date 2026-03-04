import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { analyzeResume, type ActionableSuggestion } from '../../api/openrouter';

const AIAssistantForm: React.FC = () => {
    const { data, setData } = useResume();
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [atsScore, setAtsScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<ActionableSuggestion[]>([]);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await analyzeResume(data, jobDescription);
            setAtsScore(result.score);
            setSuggestions(result.suggestions);
        } catch (err: any) {
            if (err.message === 'REGION_BLOCKED') {
                setError('Google Gemini API недоступен в вашем регионе. Пожалуйста, включите VPN для работы ИИ-помощника.');
            } else {
                setError(err.message || 'Произошла ошибка при анализе резюме.');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApplySuggestion = (suggestionData: ActionableSuggestion) => {
        if (suggestionData.isApplied) return;

        if (suggestionData.type === 'add_skill') {
            setData(prev => ({
                ...prev,
                skills: [...prev.skills, { id: Date.now().toString(), name: suggestionData.payload.name, level: suggestionData.payload.level }]
            }));
        } else if (suggestionData.type === 'update_experience') {
            setData(prev => {
                const newExp = [...prev.experience];
                const expIndex = newExp.findIndex(e => e.id === suggestionData.payload.experienceId);

                if (expIndex !== -1) {
                    newExp[expIndex] = { ...newExp[expIndex], description: suggestionData.payload.newDescription };
                } else if (newExp.length > 0) {
                    // Fallback to first if ID not matched
                    newExp[0] = { ...newExp[0], description: suggestionData.payload.newDescription || suggestionData.payload.textToAdd };
                }
                return { ...prev, experience: newExp };
            });
        } else if (suggestionData.type === 'update_summary') {
            setData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, summary: suggestionData.payload.newSummary }
            }));
        }

        // Mark as applied
        setSuggestions(prev => prev.map(s => s.id === suggestionData.id ? { ...s, isApplied: true } : s));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Input Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    Описание вакансии (Job Description)
                </label>
                <textarea
                    placeholder="Вставьте текст подходящей вакансии сюда..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={6}
                    style={{
                        width: '100%',
                        resize: 'vertical',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)'
                    }}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !jobDescription.trim()}
                    style={{
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isAnalyzing || !jobDescription.trim() ? 0.5 : 1,
                        cursor: isAnalyzing || !jobDescription.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all var(--transition-normal)'
                    }}
                >
                    {isAnalyzing ? (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="spinner-icon" style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 4.92157L16.25 7.75M7.75 16.25L4.92157 19.0784M19.0784 19.0784L16.25 16.25M7.75 7.75L4.92157 4.92157" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Анализируем...</span>
                            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Анализировать ATS & Улучшить</span>
                        </>
                    )}
                </button>
                {error && (
                    <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        {error}
                    </div>
                )}
            </div>

            {/* Results Section */}
            {atsScore !== null && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>ATS Compatibility Score</h3>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: atsScore >= 80 ? 'var(--success)' : atsScore >= 60 ? 'var(--warning)' : 'var(--danger)',
                            textShadow: `0 0 20px ${atsScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : atsScore >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                            {atsScore}%
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {atsScore >= 80 ? 'Отличный результат! Резюме хорошо подходит.' : 'Есть над чем поработать. Изучите рекомендации ниже.'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span role="img" aria-label="bulb">💡</span> AI Рекомендации
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} style={{
                                    background: suggestion.isApplied ? 'rgba(50, 215, 75, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                                    borderLeft: `3px solid ${suggestion.isApplied ? 'var(--success)' : 'var(--accent-primary)'}`,
                                    padding: '1rem',
                                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                    transition: 'all var(--transition-fast)'
                                }}>
                                    <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: suggestion.isApplied ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                        {suggestion.text}
                                    </div>
                                    <button
                                        onClick={() => handleApplySuggestion(suggestion)}
                                        disabled={suggestion.isApplied}
                                        style={{
                                            alignSelf: 'flex-start',
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            borderRadius: 'var(--radius-sm)',
                                            background: suggestion.isApplied ? 'rgba(255, 255, 255, 0.05)' : 'var(--accent-primary)',
                                            color: suggestion.isApplied ? 'var(--success)' : 'white',
                                            cursor: suggestion.isApplied ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            border: suggestion.isApplied ? '1px solid var(--success)' : '1px solid transparent'
                                        }}
                                    >
                                        {suggestion.isApplied ? (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Применено
                                            </>
                                        ) : (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Применить
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
                </div>
            )}
        </div>
    );
};

export default AIAssistantForm;
