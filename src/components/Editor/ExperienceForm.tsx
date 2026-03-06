import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useResume } from '../../context/ResumeContext';

const ExperienceForm: React.FC = () => {
    const { data, setData } = useResume();
    const { experience } = data;

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(experience);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setData(prev => ({
            ...prev,
            experience: items
        }));
    };

    const handleChange = (id: string, field: string, value: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const handleAdd = () => {
        const newId = `exp-${Date.now()}`;
        setData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: newId, company: '', position: '', startDate: '', endDate: '', description: '' }
            ]
        }));
    };

    const handleDelete = (id: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
                onClick={handleAdd}
                style={{
                    background: 'var(--text-primary)',
                    border: '2px solid var(--text-inverted)',
                    padding: '0.75rem',
                    color: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
                <span style={{ fontSize: '1.25rem' }}>+</span> Добавить место работы
            </button>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="experience-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            {experience.map((exp, index) => (
                                <Draggable key={exp.id} draggableId={exp.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                background: 'var(--bg-secondary)',
                                                border: '2px solid var(--border-color)',
                                                padding: '1rem',
                                                boxShadow: snapshot.isDragging ? 'var(--shadow-md)' : 'none',
                                                opacity: snapshot.isDragging ? 0.9 : 1,
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z" fill="currentColor" />
                                                        <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="currentColor" />
                                                        <path d="M8 18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16C7.10457 16 8 16.8954 8 18Z" fill="currentColor" />
                                                        <path d="M20 6C20 7.10457 19.1046 8 18 8C16.8954 8 16 7.10457 16 6C16 4.89543 16.8954 4 18 4C19.1046 4 20 4.89543 20 6Z" fill="currentColor" />
                                                        <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="currentColor" />
                                                        <path d="M20 18C20 19.1046 19.1046 20 18 20C16.8954 20 16 19.1046 16 18C16 16.8954 16.8954 16 18 16C19.1046 16 20 16.8954 20 18Z" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(exp.id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        color: 'var(--danger)',
                                                        fontSize: '0.875rem',
                                                        textTransform: 'none',
                                                        padding: 0
                                                    }}
                                                >
                                                    Удалить
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Название компании"
                                                        value={exp.company}
                                                        onChange={e => handleChange(exp.id, 'company', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Должность"
                                                        value={exp.position}
                                                        onChange={e => handleChange(exp.id, 'position', e.target.value)}
                                                    />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Начало (ММ/ГГГГ)"
                                                        value={exp.startDate}
                                                        onChange={e => handleChange(exp.id, 'startDate', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Конец (ММ/ГГГГ или Н.в.)"
                                                        value={exp.endDate}
                                                        onChange={e => handleChange(exp.id, 'endDate', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <textarea
                                                        placeholder="Описание обязанностей и достижений..."
                                                        value={exp.description}
                                                        onChange={e => handleChange(exp.id, 'description', e.target.value)}
                                                        rows={4}
                                                        style={{ resize: 'vertical' }}
                                                    />
                                                </div>
                                            </div>
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

export default ExperienceForm;
