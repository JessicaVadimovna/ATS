import React, { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import SectionOrderForm from './SectionOrderForm';
import { motion, AnimatePresence } from 'framer-motion';

const Editor: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'sections'>('personal');

    const tabs = [
        { id: 'personal', label: 'Инфо' },
        { id: 'experience', label: 'Опыт' },
        { id: 'education', label: 'Учеба' },
        { id: 'skills', label: 'Навыки' },
        { id: 'sections', label: 'Порядок' },
    ] as const;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                padding: '0 0.5rem',
                gap: '0.5rem',
                overflowX: 'auto',
                scrollbarWidth: 'none' /* Firefox */
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                            padding: '1rem 0.25rem',
                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            fontSize: '0.8rem',
                            boxShadow: 'none'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', overflowX: 'hidden', overflowY: 'auto', flex: 1, position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'personal' && <PersonalInfoForm />}
                        {activeTab === 'experience' && <ExperienceForm />}
                        {activeTab === 'education' && <EducationForm />}
                        {activeTab === 'skills' && <SkillsForm />}
                        {activeTab === 'sections' && <SectionOrderForm />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Editor;
