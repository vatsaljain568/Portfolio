import { GitHubCalendar } from 'react-github-calendar';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

const darkTheme = {
  dark: ['#161b22', '#2d1b4e', '#5b21b6', '#7c3aed', '#a855f7'],
};

const lightTheme = {
  light: ['#ebedf0', '#d8b4fe', '#a855f7', '#7c3aed', '#5b21b6'],
};

const REFRESH_INTERVAL = 5 * 60 * 1000; 

const useIsMobile = () => {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
};

const GitHubContributions = ({ username = 'vatsaljain568' }) => {

  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains('light'));
  const isMobile = useIsMobile();

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLastUpdated(new Date());
  }, []);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(!document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <section id="contributions" className="py-16 sm:py-24 md:py-32 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-end gap-3 sm:gap-4 mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--txt)]">Open Source</h2>
          <div className="h-px bg-purple-500/30 flex-1 mb-2"></div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6 md:p-10 overflow-x-auto theme-transition -mx-4 sm:mx-0">
          <div className="min-w-[680px]">
            <GitHubCalendar
              key={`${refreshKey}-${isDark ? 'dark' : 'light'}-${isMobile ? 'm' : 'd'}`}
              username={username}
              theme={isDark ? darkTheme : lightTheme}
              colorScheme={isDark ? 'dark' : 'light'}
              blockSize={isMobile ? 10 : 13}
              blockMargin={isMobile ? 3 : 4}
              fontSize={isMobile ? 10 : 12}
              style={{ width: '100%' }}
              labels={{
                totalCount: '{{count}} contributions this year',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--txt-muted)]">
              Updated {lastUpdated.toLocaleTimeString()} · refreshes every 5 min
            </span>
            <button
              onClick={refresh}
              className="text-[10px] font-mono text-purple-400/70 hover:text-purple-300 transition-colors"
            >
              ↻ Refresh now
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <motion.a
            href="https://github.com/vatsaljain568/resources-ai-chatbot-plugin"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-4 sm:p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--glass)] transition-colors theme-transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">GSoC 2025</span>
            </div>
            <h3 className="text-lg font-medium text-[var(--txt)] mb-2 group-hover:text-purple-400 transition-colors">
              Jenkins AI Chatbot Plugin
            </h3>
            <p className="text-sm text-[var(--txt-secondary)] leading-relaxed">
              Contributing to an AI-powered assistant plugin for Jenkins CI/CD. Built with a local LLM backend, RAG pipeline, and conversational UI to reduce the learning curve for new Jenkins users.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="px-2 py-1 text-[10px] font-mono border border-[var(--badge-border)] rounded bg-[var(--badge-bg)] text-[var(--badge-text)]">Python</span>
              <span className="px-2 py-1 text-[10px] font-mono border border-[var(--badge-border)] rounded bg-[var(--badge-bg)] text-[var(--badge-text)]">RAG</span>
              <span className="px-2 py-1 text-[10px] font-mono border border-[var(--badge-border)] rounded bg-[var(--badge-bg)] text-[var(--badge-text)]">LLM</span>
              <span className="px-2 py-1 text-[10px] font-mono border border-[var(--badge-border)] rounded bg-[var(--badge-bg)] text-[var(--badge-text)]">Java</span>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-4 sm:p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] flex flex-col justify-center theme-transition"
          >
            <p className="text-[var(--txt-secondary)] text-sm leading-relaxed mb-4">
              I believe in building in public and giving back to the tools I use daily. Currently focused on AI/ML tooling in the open-source ecosystem.
            </p>
            <a
              href="https://github.com/vatsaljain568"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2 w-fit"
            >
              View full profile on GitHub →
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default GitHubContributions;
