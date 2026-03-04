import React from 'react';
import { useResume } from '../../context/ResumeContext';

const PersonalInfoForm: React.FC = () => {
    const { data, setData } = useResume();
    const { personalInfo } = data;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [name]: value
            }
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Полное имя</label>
                <input type="text" name="fullName" value={personalInfo.fullName} onChange={handleChange} />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Желаемая должность</label>
                <input type="text" name="title" value={personalInfo.title} onChange={handleChange} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Email</label>
                    <input type="email" name="email" value={personalInfo.email} onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Телефон</label>
                    <input type="text" name="phone" value={personalInfo.phone} onChange={handleChange} />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Город / Локация</label>
                <input type="text" name="location" value={personalInfo.location} onChange={handleChange} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>GitHub</label>
                    <input type="text" name="github" value={personalInfo.github || ''} onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>LinkedIn</label>
                    <input type="text" name="linkedin" value={personalInfo.linkedin || ''} onChange={handleChange} />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>О себе (Summary)</label>
                <textarea
                    name="summary"
                    value={personalInfo.summary}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
        </div>
    );
};

export default PersonalInfoForm;
