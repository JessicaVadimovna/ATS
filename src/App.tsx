import { useState } from 'react';
import Editor from './components/Editor/Editor';
import Preview from './components/Preview/Preview';
import AIAssistantForm from './components/Editor/AIAssistantForm';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar: Editor */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h1 className="accent-gradient-text" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span role="img" aria-label="sparkles">✨</span> AI Resume Builder
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Подгоните резюме под идеальную вакансию
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'hidden' }}>
          <Editor />
        </div>
      </aside>

      {/* Main: Live Preview */}
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
