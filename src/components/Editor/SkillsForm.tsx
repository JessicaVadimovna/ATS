import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useResume } from '../../context/ResumeContext';

const SkillsForm: React.FC = () => {
    const { data, setData } = useResume();
    const { skills } = data;

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(skills);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setData(prev => ({
            ...prev,
            skills: items
        }));
    };

    const handleChange = (id: string, field: string, value: string | number) => {
        setData(prev => ({
            ...prev,
            skills: prev.skills.map(skill =>
                skill.id === id ? { ...skill, [field]: value } : skill
            )
        }));
    };

    const handleAdd = () => {
        const newId = `skill-${Date.now()}`;
        setData(prev => ({
            ...prev,
            skills: [
                ...prev.skills,
                { id: newId, name: '', level: 3 }
            ]
        }));
    };

    const handleDelete = (id: string) => {
        setData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill.id !== id)
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
                onClick={handleAdd}
                style={{
                    background: 'var(--bg-input)',
                    border: '1px dashed var(--border-color)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
                <span style={{ fontSize: '1.25rem' }}>+</span> Добавить навык
            </button>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="skills-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                        >
                            {skills.map((skill, index) => (
                                <Draggable key={skill.id} draggableId={skill.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-sm)',
                                                padding: '0.75rem 1rem',
                                                boxShadow: snapshot.isDragging ? 'var(--shadow-md)' : 'none',
                                                opacity: snapshot.isDragging ? 0.9 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z" fill="currentColor" />
                                                    <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="currentColor" />
                                                    <path d="M8 18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16C7.10457 16 8 16.8954 8 18Z" fill="currentColor" />
                                                    <path d="M20 6C20 7.10457 19.1046 8 18 8C16.8954 8 16 7.10457 16 6C16 4.89543 16.8954 4 18 4C19.1046 4 20 4.89543 20 6Z" fill="currentColor" />
                                                    <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="currentColor" />
                                                    <path d="M20 18C20 19.1046 19.1046 20 18 20C16.8954 20 16 19.1046 16 18C16 16.8954 16.8954 16 18 16C19.1046 16 20 16.8954 20 18Z" fill="currentColor" />
                                                </svg>
                                            </div>

                                            <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Навык (например, TypeScript)"
                                                    value={skill.name}
                                                    onChange={e => handleChange(skill.id, 'name', e.target.value)}
                                                    style={{ flex: 1 }}
                                                />
                                                <select
                                                    value={skill.level}
                                                    onChange={e => handleChange(skill.id, 'level', parseInt(e.target.value))}
                                                    style={{ width: '120px' }}
                                                >
                                                    <option value={1}>Новичок</option>
                                                    <option value={2}>Базовый</option>
                                                    <option value={3}>Средний</option>
                                                    <option value={4}>Продвинутый</option>
                                                    <option value={5}>Эксперт</option>
                                                </select>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(skill.id)}
                                                style={{ color: 'var(--text-muted)' }}
                                                onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
                                                onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default SkillsForm;
