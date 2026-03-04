import React from 'react';
import { useResume } from '../../context/ResumeContext';
import type { SectionId } from '../../types/resume';

const ResumeDocument: React.FC = () => {
    const { data, sectionOrder } = useResume();
    const { personalInfo, experience, education, skills } = data;

    const renderSection = (sectionId: SectionId) => {
        switch (sectionId) {
            case 'personalInfo':
                return (
                    <div key="personalInfo">
                        {/* Header */}
                        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                                {personalInfo.fullName || 'Имя Фамилия'}
                            </h1>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 500, color: '#334155', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                                {personalInfo.title || 'Должность'}
                            </h2>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
                                {personalInfo.email && <span>📧 {personalInfo.email}</span>}
                                {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
                                {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                                {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
                                {personalInfo.github && <span>💻 {personalInfo.github}</span>}
                            </div>
                        </div>

                        {/* Summary */}
                        {personalInfo.summary && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#334155', fontWeight: 400 }}>
                                    {personalInfo.summary}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 'experience':
                return experience.length > 0 && (
                    <div key="experience" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                            Опыт работы
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                            {exp.position}
                                        </h4>
                                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                                            {exp.startDate} {exp.startDate || exp.endDate ? '—' : ''} {exp.endDate}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {exp.company}
                                    </div>
                                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-wrap' }}>
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'education':
                return education.length > 0 && (
                    <div key="education" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                            Образование
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {education.map(edu => (
                                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '0.25rem' }}>
                                            {edu.institution}
                                        </h4>
                                        <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                                            {edu.degree}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                                        {edu.startDate} {edu.startDate || edu.endDate ? '—' : ''} {edu.endDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'skills':
                return skills.length > 0 && (
                    <div key="skills" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                            Навыки
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skills.map(skill => (
                                <span
                                    key={skill.id}
                                    style={{
                                        background: '#f1f5f9',
                                        color: '#334155',
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '6px', /* more elegant than full pill for a pro resume */
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.02em'
                                    }}
                                >
                                    {skill.name} {skill.level >= 4 ? '⭐' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="resume-document"
            style={{
                backgroundColor: '#ffffff',
                color: '#1f2937',
                fontFamily: "'Inter', sans-serif",
                padding: '2.5rem',
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
            }}
        >
            {sectionOrder.map(renderSection)}
        </div>
    );
};

export default ResumeDocument;
