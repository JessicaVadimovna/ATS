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
                const width = containerRef.current.offsetWidth;
                // 794px is A4 width. We leave ~40px total padding.
                if (width < 834) {
                    setScale((width - 40) / 794);
                } else {
                    setScale(1);
                }
            }
        };

        updateScale();
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
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflowX: 'hidden', gap: '1.5rem' }}>

            {/* Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                maxWidth: '794px'
            }}>
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    style={{
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow-glow)',
                        opacity: isExporting ? 0.7 : 1,
                        transition: 'all var(--transition-normal)'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {isExporting ? 'Экспорт...' : 'Скачать PDF'}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V16M16 12L12 16M12 16L8 12M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* A4 Container Scaler */}
            <div style={{
                width: '100%',
                maxWidth: '794px',
                height: `${1123 * scale}px`, // Reserve exact scaled height so layout doesn't jump
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                transformOrigin: 'top center',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-panel"
                    style={{
                        width: '794px',
                        height: '1123px', // Exact A4 dimensions mapped 1:1 to mm
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        position: 'absolute',
                        top: 0,
                        transformOrigin: 'top center',
                        transform: `scale(${scale})`, // Perfectly scale down for mobile
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
