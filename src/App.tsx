import { useState } from 'react';
import Editor from './components/Editor/Editor';
import Preview from './components/Preview/Preview';
import AIAssistantForm from './components/Editor/AIAssistantForm';
import { useResume } from './context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const { isSaved } = useResume();

  return (
    <div className="app-container">
      {/* Sidebar: Editor */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h1 className="accent-gradient-text" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span role="img" aria-label="sparkles">✨</span> JessiLis AI Resume Builder
          </h1>
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

        {/* Mobile-only Bottom Bar: PDF preview toggle + download hint */}
        <div className="mobile-bottom-bar">
          <button
            className="mobile-preview-toggle"
            onClick={() => setIsMobilePreviewOpen(v => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M9 16H15M9 8H15M5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isMobilePreviewOpen ? 'Скрыть резюме' : 'Предпросмотр резюме'}
          </button>
        </div>
      </aside>

      {/* Desktop: Live Preview */}
      <main className="preview-area">
        <Preview />
      </main>

      {/* Mobile: Full-Screen Preview Drawer (slides up from bottom) */}
      <AnimatePresence>
        {isMobilePreviewOpen && (
          <>
            <motion.div
              className="mobile-preview-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobilePreviewOpen(false)}
            />
            <motion.div
              className="mobile-preview-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            >
              <div className="mobile-preview-handle" onClick={() => setIsMobilePreviewOpen(false)}>
                <div className="mobile-preview-handle-bar" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Нажмите чтобы закрыть</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                <Preview />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
