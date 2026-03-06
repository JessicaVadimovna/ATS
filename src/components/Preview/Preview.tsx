import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';
import ResumeDocument from './ResumeDocument';
import { useResume } from '../../context/ResumeContext';

const Preview: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const resumeRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [scale, setScale] = useState(1);
    const { data } = useResume();

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;

                // On mobile, the container might report 0 initially if inside a drawer,
                // so we fallback to window.innerWidth with some padding.
                const width = containerWidth > 0 ? containerWidth : (window.innerWidth - 32);

                // 794px is the exact A4 width used by html2pdf and the container.
                const padding = 32; // 16px padding on each side
                const availableWidth = width - padding;

                if (availableWidth < 794) {
                    const newScale = Math.max(0.1, availableWidth / 794);
                    setScale(newScale);
                } else {
                    setScale(1);
                }
            }
        };

        // Запускаем сразу и после небольшой задержки (для Framer Motion)
        updateScale();
        setTimeout(updateScale, 100);
        setTimeout(updateScale, 300);

        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const handleExportPDF = () => {
        if (!resumeRef.current) return;

        setIsExporting(true);
        const element = resumeRef.current;

        const opt: any = {
            margin: 0,
            filename: `resume_${data.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setIsExporting(false);
        });
    };

    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflowX: 'hidden', paddingBottom: '2rem', gap: '1rem' }}>

            {/* Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                padding: '0 1rem',
                maxWidth: '794px'
            }}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleExportPDF();
                    }}
                    disabled={isExporting}
                    style={{
                        background: 'var(--text-primary)',
                        color: 'var(--bg-primary)',
                        border: '2px solid var(--text-inverted)',
                        padding: '0.85rem 2rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        boxShadow: '4px 4px 0px rgba(0,0,0,1)',
                        opacity: isExporting ? 0.7 : 1,
                        transition: 'transform 0.1s, box-shadow 0.1s',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,1)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,1)'; }}
                    onMouseDown={e => { e.currentTarget.style.transform = 'translate(4px, 4px)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,1)'; }}
                >
                    {isExporting ? 'Экспорт...' : 'Скачать PDF'}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V16M16 12L12 16M12 16L8 12M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* A4 Container Scaler */}
            <div style={{
                width: `${Math.floor(794 * scale)}px`, /* Force container to be EXACTLY the scaled size to prevent flex overflow */
                height: `${Math.ceil(1123 * scale)}px`,
                position: 'relative',
                overflow: 'hidden', /* Try hiding overflowing box shadows that cause scrollbars */
                marginTop: '1rem',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                        width: '794px',
                        height: '1123px', // Exact A4 dimensions
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transformOrigin: 'top left', // Safe transform origin
                        transform: `scale(${scale})`, // Perfectly scale down 
                    }}
                >
                    <div ref={resumeRef} style={{ width: '100%', height: '100%' }}>
                        <ResumeDocument />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Preview;
