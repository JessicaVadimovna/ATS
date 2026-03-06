import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useResume } from '../../context/ResumeContext';
import type { SectionId } from '../../types/resume';

const sectionLabels: Record<SectionId, string> = {
    personalInfo: 'Личная информация',
    experience: 'Опыт работы',
    education: 'Образование',
    skills: 'Навыки',
};

const SectionOrderForm: React.FC = () => {
    const { sectionOrder, setSectionOrder } = useResume();

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(sectionOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSectionOrder(items);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
                background: 'var(--bg-secondary)',
                border: '2px solid var(--accent-primary)',
                boxShadow: '4px 4px 0px var(--accent-primary)',
                padding: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                lineHeight: '1.5'
            }}>
                <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>ℹ️</span>
                Перетаскивайте блоки ниже, чтобы изменить их порядок отображения в итоговом резюме. Теперь вы можете переместить любой раздел, включая личную информацию!
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                        >
                            {sectionOrder.map((sectionId, index) => (
                                <Draggable
                                    key={sectionId}
                                    draggableId={sectionId}
                                    index={index}
                                >
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
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                cursor: 'default'
                                            }}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                style={{
                                                    cursor: 'grab',
                                                    color: 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z" fill="currentColor" />
                                                    <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="currentColor" />
                                                    <path d="M8 18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16C7.10457 16 8 16.8954 8 18Z" fill="currentColor" />
                                                    <path d="M20 6C20 7.10457 19.1046 8 18 8C16.8954 8 16 7.10457 16 6C16 4.89543 16.8954 4 18 4C19.1046 4 20 4.89543 20 6Z" fill="currentColor" />
                                                    <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="currentColor" />
                                                    <path d="M20 18C20 19.1046 19.1046 20 18 20C16.8954 20 16 19.1046 16 18C16 16.8954 16.8954 16 18 16C19.1046 16 20 16.8954 20 18Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <div style={{ flex: 1, fontWeight: 500 }}>
                                                {sectionLabels[sectionId]}
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

export default SectionOrderForm;
