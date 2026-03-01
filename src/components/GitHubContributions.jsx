import { GitHubCalendar } from 'react-github-calendar';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

/**
 * Renders this year's GitHub contribution graph with a purple theme.
 * Re-fetches contribution data every 5 minutes so it stays up-to-date
 * without a full page reload. Uses a `key` prop on GitHubCalendar to
 * force re-mount and trigger its internal fetch.
 */

const customTheme = {
  dark: ['#161b22', '#2d1b4e', '#5b21b6', '#7c3aed', '#a855f7'],
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const GitHubContributions = ({ username = 'vatsaljain568' }) => {
  // Incrementing the key forces GitHubCalendar to unmount/remount,
  // which triggers a fresh fetch from the contributions API.
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <section id="contributions" className="py-24 md:py-32 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-end gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-white">Open Source</h2>
          <div className="h-px bg-purple-500/30 flex-1 mb-2"></div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-10 overflow-x-auto">
          <div className="min-w-[680px]">
            <GitHubCalendar
              key={refreshKey}
              username={username}
              theme={customTheme}
              colorScheme="dark"
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              style={{ width: '100%' }}
              labels={{
                totalCount: '{{count}} contributions this year',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <span className="text-[10px] font-mono text-gray-600">
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

        {/* OSS highlight card */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.a
            href="https://github.com/vatsaljain568/resources-ai-chatbot-plugin"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 text-sm">⚡</span>
              </div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">GSoC 2025</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-300 transition-colors">
              Jenkins AI Chatbot Plugin
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Contributing to an AI-powered assistant plugin for Jenkins CI/CD. Built with a local LLM backend, RAG pipeline, and conversational UI to reduce the learning curve for new Jenkins users.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded bg-white/5 text-gray-300">Python</span>
              <span className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded bg-white/5 text-gray-300">RAG</span>
              <span className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded bg-white/5 text-gray-300">LLM</span>
              <span className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded bg-white/5 text-gray-300">Java</span>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col justify-center"
          >
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
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
