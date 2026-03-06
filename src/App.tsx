import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Editor from './components/Editor/Editor';
import Preview from './components/Preview/Preview';
import ResumeDocument from './components/Preview/ResumeDocument';
import AIAssistantForm from './components/Editor/AIAssistantForm';
import { useResume } from './context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isExportingMobile, setIsExportingMobile] = useState(false);
  const hiddenResumeRef = useRef<HTMLDivElement>(null);
  const { isSaved, data } = useResume();

  const handleMobileExport = () => {
    if (!hiddenResumeRef.current) return;

    setIsExportingMobile(true);
    const element = hiddenResumeRef.current;

    const opt: any = {
      margin: 0,
      filename: `resume_${data.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).outputPdf('bloburl').then((pdfUrl: string) => {
      window.open(pdfUrl, '_blank');
      setIsExportingMobile(false);
    });
  };

  return (
    <div className="app-container">
      {/* Hidden container for mobile PDF generation */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', height: '1123px' }}>
        <div ref={hiddenResumeRef} style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
          <ResumeDocument />
        </div>
      </div>

      {/* Sidebar: Editor */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src="/logo.png"
            alt="JessiLis AI Resume Builder"
            style={{ maxHeight: '40px', display: 'block', marginBottom: '0.25rem' }}
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Подгоните резюме под идеальную вакансию
            <AnimatePresence>
              {isSaved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  ✓ Сохранено
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'hidden' }}>
          <Editor />
        </div>

        {/* Mobile-only Bottom Bar: Direct PDF Download */}
        <div className="mobile-bottom-bar">
          <button
            className="mobile-preview-toggle"
            onClick={handleMobileExport}
            disabled={isExportingMobile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V16M16 12L12 16M12 16L8 12M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isExportingMobile ? 'Сборка PDF...' : 'ПОКАЗАТЬ PDF'}
          </button>
        </div>
      </aside>

      {/* Desktop: Live Preview */}
      <main className="preview-area">
        <Preview />
      </main>

      {/* AI Floating Action Button (FAB) */}
      <motion.button
        className="ai-fab"
        onClick={() => setIsAIOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <span className="ai-fab-icon">✨</span>
        <span className="ai-fab-text">AI Co-Pilot</span>
      </motion.button>

      {/* AI Co-Pilot Overlay & Drawer */}
      <AnimatePresence>
        {isAIOpen && (
          <>
            <motion.div
              className="ai-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIOpen(false)}
            />
            <motion.div
              className="ai-drawer glass-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="ai-drawer-header">
                <div>
                  <h2 className="accent-gradient-text" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    ✨ AI Co-Pilot
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, marginTop: '0.25rem' }}>Анализ и улучшение под вакансию</p>
                </div>
                <button
                  className="ai-drawer-close"
                  onClick={() => setIsAIOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="ai-drawer-content">
                <AIAssistantForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
