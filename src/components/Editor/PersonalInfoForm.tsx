import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useResume } from '../../context/ResumeContext';

const SUMMARY_MAX = 350;

const tips: { field: string; hint: string; icon: string }[] = [
    { field: 'fullName', hint: 'Используйте полное имя — как в паспорте или LinkedIn', icon: '👤' },
    { field: 'title', hint: 'Напишите точно так, как указано в желаемой вакансии', icon: '💼' },
    { field: 'email', hint: 'Профессиональный адрес: имя.фамилия@gmail.com', icon: '📧' },
    { field: 'phone', hint: 'Формат: +7 (999) 123-45-67', icon: '📱' },
    { field: 'location', hint: 'Укажите город. Добавьте "готов к переезду" если да', icon: '📍' },
    { field: 'github', hint: 'github.com/username — без https://', icon: '🐙' },
    { field: 'linkedin', hint: 'linkedin.com/in/username — без https://', icon: '🔗' },
    { field: 'summary', hint: '3-4 предложения: кто вы, ваши ключевые навыки и цель. Используйте ключевые слова из вакансии.', icon: '✍️' },
];

const PersonalInfoForm: React.FC = () => {
    const { data, setData } = useResume();
    const { personalInfo } = data;
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'summary' && value.length > SUMMARY_MAX) return;
        setData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const activeTip = tips.find(t => t.field === focusedField);
    const summaryLen = personalInfo.summary?.length || 0;
    const summaryRatio = summaryLen / SUMMARY_MAX;

    const fieldProps = (name: string, label: string, type: string = 'text', placeholder = '') => ({
        label,
        inputEl: (
            <input
                id={`pif-${name}`}
                type={type}
                name={name}
                value={(personalInfo as any)[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                style={{ borderColor: focusedField === name ? 'var(--accent-primary)' : undefined }}
            />
        )
    });

    const fields = [
        fieldProps('fullName', 'Полное имя', 'text', 'Иван Иванов'),
        fieldProps('title', 'Желаемая должность', 'text', 'Frontend Developer'),
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Hint bar */}
            <motion.div
                animate={{ opacity: activeTip ? 1 : 0, y: activeTip ? 0 : -6 }}
                transition={{ duration: 0.2 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minHeight: '2.4rem',
                    pointerEvents: 'none',
                }}
            >
                {activeTip && <><span>{activeTip.icon}</span><span>{activeTip.hint}</span></>}
            </motion.div>

            {/* Full name */}
            <div className="form-field">
                <label htmlFor="pif-fullName">Полное имя</label>
                <input id="pif-fullName" type="text" name="fullName"
                    value={personalInfo.fullName} onChange={handleChange} placeholder="Иван Иванов"
                    onFocus={() => setFocusedField('fullName')} onBlur={() => setFocusedField(null)}
                    style={{ borderColor: focusedField === 'fullName' ? 'var(--accent-primary)' : undefined }}
                />
            </div>

            {/* Title */}
            <div className="form-field">
                <label htmlFor="pif-title">Желаемая должность</label>
                <input id="pif-title" type="text" name="title"
                    value={personalInfo.title} onChange={handleChange} placeholder="Frontend Developer"
                    onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField(null)}
                    style={{ borderColor: focusedField === 'title' ? 'var(--accent-primary)' : undefined }}
                />
            </div>

            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-field">
                    <label htmlFor="pif-email">Email</label>
                    <input id="pif-email" type="email" name="email"
                        value={personalInfo.email} onChange={handleChange} placeholder="ivan@example.com"
                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                        style={{ borderColor: focusedField === 'email' ? 'var(--accent-primary)' : undefined }}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="pif-phone">Телефон</label>
                    <input id="pif-phone" type="text" name="phone"
                        value={personalInfo.phone} onChange={handleChange} placeholder="+7 999 123-45-67"
                        onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                        style={{ borderColor: focusedField === 'phone' ? 'var(--accent-primary)' : undefined }}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="form-field">
                <label htmlFor="pif-location">Город / Локация</label>
                <input id="pif-location" type="text" name="location"
                    value={personalInfo.location} onChange={handleChange} placeholder="Москва, Россия"
                    onFocus={() => setFocusedField('location')} onBlur={() => setFocusedField(null)}
                    style={{ borderColor: focusedField === 'location' ? 'var(--accent-primary)' : undefined }}
                />
            </div>

            {/* GitHub + LinkedIn */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-field">
                    <label htmlFor="pif-github">GitHub</label>
                    <input id="pif-github" type="text" name="github"
                        value={personalInfo.github || ''} onChange={handleChange} placeholder="github.com/username"
                        onFocus={() => setFocusedField('github')} onBlur={() => setFocusedField(null)}
                        style={{ borderColor: focusedField === 'github' ? 'var(--accent-primary)' : undefined }}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="pif-linkedin">LinkedIn</label>
                    <input id="pif-linkedin" type="text" name="linkedin"
                        value={personalInfo.linkedin || ''} onChange={handleChange} placeholder="linkedin.com/in/username"
                        onFocus={() => setFocusedField('linkedin')} onBlur={() => setFocusedField(null)}
                        style={{ borderColor: focusedField === 'linkedin' ? 'var(--accent-primary)' : undefined }}
                    />
                </div>
            </div>

            {/* Summary + Character Counter */}
            <div className="form-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label htmlFor="pif-summary" style={{ margin: 0 }}>О себе (Summary)</label>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: summaryRatio > 0.9 ? '#f87171' : summaryRatio > 0.7 ? '#fbbf24' : 'var(--text-muted)'
                    }}>
                        {summaryLen} / {SUMMARY_MAX}
                    </span>
                </div>
                <div style={{ position: 'relative' }}>
                    <textarea
                        id="pif-summary"
                        name="summary"
                        value={personalInfo.summary}
                        onChange={handleChange}
                        rows={4}
                        onFocus={() => setFocusedField('summary')}
                        onBlur={() => setFocusedField(null)}
                        style={{ borderColor: focusedField === 'summary' ? 'var(--accent-primary)' : undefined }}
                    />
                    {/* Progress bar */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '2px',
                        width: `${Math.min(summaryRatio * 100, 100)}%`,
                        background: summaryRatio > 0.9
                            ? '#f87171'
                            : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                        transition: 'width 0.3s ease, background 0.3s ease',
                    }} />
                </div>
            </div>

            {/* Unused variable to satisfy TS (fields array built but not rendered via map - kept for reference) */}
            {fields.length === 0 && null}
        </div>
    );
};

export default PersonalInfoForm;
